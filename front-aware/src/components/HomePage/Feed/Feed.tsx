import React, {useEffect, useRef, useState} from 'react';
import ArticleFeed from '../../Cards/ArticleLayouts/ArticleFeedLayout.tsx';
import ThreadFeed from '../../Cards/ThreadLayouts/ThreadFeedLayout.tsx';
import {BASE_URL} from '../../../api/config.ts';
import {FaArrowLeft, FaArrowRight} from 'react-icons/fa';

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
    credibility_label: string;
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

type Props = {
    selectedView: 'All' | 'Articles' | 'Threads';
    selectedTopics: string[];
    selectedLanguages: string[];
    selectedSort: 'Newest' | 'Popular' | 'Verified Only';
};

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

const Feed: React.FC<Props> = ({selectedView, selectedTopics, selectedLanguages, selectedSort}) => {
    const feedRef = useRef<HTMLDivElement>(null);
    const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);


    const [allItems, setAllItems] = useState<FeedItem[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setPage(1);
    }, [selectedView, selectedTopics, selectedLanguages, selectedSort]);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token || selectedLanguages.length === 0 || selectedTopics.length === 0) return;

        const fetchFeed = async () => {
            setLoading(true);
            try {
                const type = selectedView === 'All' ? 'both' : selectedView.toLowerCase();
                const sortField = selectedSort === 'Popular' ? 'views' : 'published';
                const topics = selectedTopics.map(t => t.toLowerCase()).join(',');
                const langs = selectedLanguages.map(languageToCode).join(',');

                let pageNum = 1;
                const accumulated: FeedItem[] = [];

                while (true) {
                    const url = `${BASE_URL}/feed?feed_type=${type}&topics=${topics}&languages=${langs}&page=${pageNum}&size=${PAGE_SIZE}&sort=${sortField}`;

                    const res = await fetch(url, {
                        headers: {Authorization: `Bearer ${token}`},
                    });

                    const {articles = [], threads = []} = await res.json();
                    let filteredArticles = articles;
                    let filteredThreads = threads;

                    if (selectedView === 'Articles') {
                        filteredThreads = [];
                    } else if (selectedView === 'Threads') {
                        filteredArticles = [];
                    }

                    if (articles.length === 0 && threads.length === 0) break;

                    const articleMap = new Map<string, Article>(
                        filteredArticles.map((a: RawArticle) => [
                            a._id,
                            {
                                id: a._id,
                                isThread: false,
                                title: a.title,
                                author: a.author || 'Unknown',
                                topic: (a.topic || a.topics?.[0] || 'general').toLowerCase(),
                                date: new Date(a.published).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                }),
                                rawDate: a.published,
                                site: a.source,
                                description: a.description || '',
                                commentsCount: a.commentsCount || 0,
                                views: a.views || 0,
                                image: a.image || '',
                                credibility_label: a.credibility_label || '',
                            },
                        ])
                    );

                    const requiredArticleIds = new Set<string>();
                    filteredThreads.forEach((t: RawThread) => {
                        (t.articles || []).forEach((id: string) => {
                            if (!articleMap.has(id)) requiredArticleIds.add(id);
                        });
                    });

                    if (requiredArticleIds.size > 0) {
                        const missing = await Promise.all(
                            Array.from(requiredArticleIds).map(async id => {
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
                                    date: new Date(a.published).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    }),
                                    rawDate: a.published,
                                    site: a.source,
                                    description: a.description || '',
                                    commentsCount: a.commentsCount || 0,
                                    views: a.views || 0,
                                    image: a.image || '',
                                    credibility_label: a.credibility_label || '',

                                };
                            })
                        );
                        for (const a of missing) {
                            articleMap.set(a.id, a as Article);
                        }
                    }

                    const threadObjects: Thread[] = filteredThreads.map((t: RawThread) => {
                        const resolved = (t.articles || [])
                            .map((id: string) => articleMap.get(id))
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

                    let combined: FeedItem[] = [];

                    if (selectedView === 'Articles') {
                        const threadArticleIds = new Set<string>();
                        threadObjects.forEach(t => t.articles.forEach(a => threadArticleIds.add(a.id)));

                        for (const id of threadArticleIds) {
                            articleMap.delete(id);
                        }

                        const flatArticles = Array.from(articleMap.values());
                        combined = flatArticles;
                    } else if (selectedView === 'Threads') {
                        combined = threadObjects;
                    } else {
                        const threadArticleIds = new Set<string>();
                        threadObjects.forEach(t => t.articles.forEach(a => threadArticleIds.add(a.id)));

                        for (const id of threadArticleIds) {
                            articleMap.delete(id);
                        }

                        const flatArticles = Array.from(articleMap.values());
                        combined = [...flatArticles, ...threadObjects];
                    }

                    accumulated.push(...combined);


                    pageNum++;
                }

                if (selectedSort === 'Newest') {
                    accumulated.sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());
                } else if (selectedSort === 'Popular') {
                    accumulated.sort((a, b) => {
                        const aViews = a.isThread ? Math.max(...a.articles.map(art => art.views)) : a.views;
                        const bViews = b.isThread ? Math.max(...b.articles.map(art => art.views)) : b.views;
                        return bViews - aViews;
                    });
                }

                setAllItems(accumulated);
            } catch (err) {
                console.error('[Feed] Failed to load:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, [selectedView, selectedTopics, selectedLanguages, selectedSort]);

    const totalPages = Math.ceil(allItems.length / PAGE_SIZE);
    const paginated = allItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const nextPage = () => {
        if (page < totalPages) setPage(p => p + 1);
    };

    const prevPage = () => {
        if (page > 1) setPage(p => p - 1);
    };

    useEffect(() => {
        if (feedRef.current) {
            feedRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    }, [page]);

    return (
        <div ref={feedRef} style={{display: 'flex', flexDirection: 'column', gap: 10, marginTop: 30, marginLeft: 20}}>
            {loading ? (
                <div style={{padding: 16}}>Loading feed...</div>
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

export default Feed;
