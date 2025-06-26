import React, {useEffect, useRef, useState} from 'react';
import {Link, useSearchParams} from 'react-router-dom';
import ArticleFeed from '../Cards/ArticleLayouts/ArticleFeedLayout';
import ThreadFeed from '../Cards/ThreadLayouts/ThreadFeedLayout';
import {BASE_URL} from '../../api/config';
import {FaArrowLeft, FaArrowRight} from 'react-icons/fa';
import {TOPIC_COLORS} from '../Cards/Tags/TagColor';
import TopicTag from '../Cards/Tags/TopicTag';

type Article = {
    id: string;
    title: string;
    date: string;
    topic: string;
    author: string;
    site: string;
    description: string;
    commentsCount: number;
    views: number;
    image: string;
    isThread: false;
    rawDate: string;
    credibility_label?: string;
};

type Thread = {
    id: string;
    threadTitle: string;
    lastUpdated: string;
    articles: Article[];
    isThread: true;
    rawDate: string;
};

type RawArticle = {
    _id: string;
    title: string;
    author?: string;
    topic?: string;
    topics?: string[];
    published: string;
    source: string;
    description?: string;
    commentsCount?: number;
    views?: number;
    image?: string;
    credibility_label?: string;
};

type RawThread = {
    _id: string;
    title: string;
    last_updated: string;
    articles: string[];
};

type FeedItem = Article | Thread;

const PAGE_SIZE = 15;

const languageToCode = (lang: string): string => {
    const map: Record<string, string> = {
        english: 'en',
        romanian: 'ro',
        french: 'fr',
        german: 'de',
        spanish: 'es',
    };
    return map[lang.toLowerCase()] || lang.toLowerCase();
};

const DiscoverFeed: React.FC = () => {
    const feedRef = useRef<HTMLDivElement>(null);
    const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
    const [allItems, setAllItems] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const [page, setPage] = useState<number>(currentPage);

    useEffect(() => {
        setSearchParams({page: String(page)});
    }, [page]);

    useEffect(() => {
        const fetchDiscover = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            setLoading(true);
            try {
                const userRes = await fetch(`${BASE_URL}/users/me`, {
                    headers: {Authorization: `Bearer ${token}`},
                });
                const user = await userRes.json();
                const favoriteTopics: string[] = (user.favoriteTopics || []).map((t: string) => t.toLowerCase());
                const languages: string[] = (user.language || []).map(languageToCode);

                const allTopics = Object.keys(TOPIC_COLORS).filter(
                    (t) => !['general', 'all', 'local'].includes(t.toLowerCase())
                );
                const discoverTopics = allTopics.filter((t) => !favoriteTopics.includes(t));


                const topicQuery = discoverTopics.join(',');
                const langQuery = languages.join(',');

                const url = `${BASE_URL}/feed?feed_type=both&topics=${encodeURIComponent(topicQuery)}&languages=${encodeURIComponent(langQuery)}&page=1&size=100&sort=published`;

                const res = await fetch(url, {
                    headers: {Authorization: `Bearer ${token}`},
                });

                const {articles = [], threads = []} = await res.json();

                const articleMap = new Map<string, Article>(
                    articles.map((a: RawArticle) => [
                        a._id,
                        {
                            id: a._id,
                            isThread: false,
                            title: a.title,
                            author: a.author || 'Unknown',
                            topic: (a.topic || a.topics?.[0] || 'general').toLowerCase(),
                            date: new Date(a.published).toLocaleDateString(),
                            rawDate: a.published,
                            site: a.source,
                            description: a.description || '',
                            commentsCount: a.commentsCount || 0,
                            views: a.views || 0,
                            image: a.image || '',
                            credibility_label: a.credibility_label,
                        },
                    ])
                );

                const requiredArticleIds = new Set<string>();
                threads.forEach((t: RawThread) => {
                    t.articles.forEach((id) => {
                        if (!articleMap.has(id)) requiredArticleIds.add(id);
                    });
                });

                if (requiredArticleIds.size > 0) {
                    const missing = await Promise.all(
                        Array.from(requiredArticleIds).map(async (id) => {
                            const r = await fetch(`${BASE_URL}/articles/${id}`, {
                                headers: {Authorization: `Bearer ${token}`},
                            });
                            const a = await r.json();
                            return {
                                id: a._id,
                                isThread: false,
                                title: a.title,
                                author: a.author || 'Unknown',
                                topic: (a.topic || a.topics?.[0] || 'general').toLowerCase(),
                                date: new Date(a.published).toLocaleDateString(),
                                rawDate: a.published,
                                site: a.source,
                                description: a.description || '',
                                commentsCount: a.commentsCount || 0,
                                views: a.views || 0,
                                image: a.image || '',
                                credibility_label: a.credibility_label,
                            };
                        })
                    );
                    for (const a of missing) {
                        articleMap.set(a.id, a as Article);
                    }
                }

                const threadObjects: Thread[] = threads.map((t: RawThread) => {
                    const resolved = (t.articles || [])
                        .map((id) => articleMap.get(id))
                        .filter(Boolean) as Article[];

                    return {
                        id: t._id,
                        threadTitle: t.title,
                        lastUpdated: new Date(t.last_updated).toLocaleDateString(),
                        rawDate: t.last_updated,
                        isThread: true,
                        articles: resolved,
                    };
                });

                const threadArticleIds = new Set<string>();
                threadObjects.forEach((t) => t.articles.forEach((a) => threadArticleIds.add(a.id)));
                for (const id of threadArticleIds) articleMap.delete(id);

                const flatArticles = Array.from(articleMap.values());
                const combined: FeedItem[] = [...flatArticles, ...threadObjects];

                combined.sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());

                setAllItems(combined);
            } catch (err) {
                console.error('[DiscoverFeed] Error loading discover content:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDiscover();
    }, []);

    const totalPages = Math.ceil(allItems.length / PAGE_SIZE);
    const paginated = allItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const nextPage = () => {
        if (page < totalPages) setPage((p) => p + 1);
    };

    const prevPage = () => {
        if (page > 1) setPage((p) => p - 1);
    };

    useEffect(() => {
        if (feedRef.current) {
            feedRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    }, [page]);

    return (
        <div ref={feedRef} style={{display: 'flex', flexDirection: 'column', gap: 10, marginTop: 30, marginLeft: 20}}>
            <div
                style={{
                    display: 'flex',
                    gap: '8px',
                    overflowX: 'auto',
                    paddingBottom: '4px',
                    whiteSpace: 'nowrap',
                    marginBottom: '20px',
                }}
            >
                {Object.keys(TOPIC_COLORS)
                    .filter(k => k !== 'local' && k !== 'all' && k !== 'general')
                    .map((key) => (
                        <Link to={`/topic/${encodeURIComponent(key)}`} key={key} style={{textDecoration: 'none'}}>
                            <TopicTag
                                label={key}
                                style={{
                                    padding: '4px 8px',
                                    fontSize: '15px',
                                    fontWeight: 500,
                                    flexShrink: 0,
                                    cursor: 'pointer',
                                    justifyContent: 'center',
                                }}
                            />
                        </Link>
                    ))}
            </div>

            {loading ? (
                <div style={{padding: 16}}>Loading discover feed...</div>
            ) : (
                <>
                    {paginated.map((item, index) =>
                        item.isThread ? (
                            <ThreadFeed
                                key={item.id}
                                thread={item}
                                threadIndex={index}
                                hoveredItemId={null}
                                setHoveredItemId={() => {
                                }}
                            />
                        ) : (
                            <ArticleFeed
                                key={item.id}
                                article={item}
                                id={item.id}
                                isHovered={hoveredItemId === item.id}
                                onHover={setHoveredItemId}
                            />
                        )
                    )}

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 12,
                        marginTop: 24
                    }}>
                        <button onClick={prevPage} disabled={page === 1}>
                            <FaArrowLeft/> Prev
                        </button>
                        <span>Page {page} of {totalPages}</span>
                        <button onClick={nextPage} disabled={page === totalPages}>
                            Next <FaArrowRight/>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default DiscoverFeed;
