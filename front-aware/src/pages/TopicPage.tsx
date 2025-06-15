import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {FaArrowLeft, FaArrowRight, FaStar} from 'react-icons/fa';
import TopicTag from '../components/Cards/Tags/TopicTag';
import ArticleFeed from '../components/Cards/ArticleLayouts/ArticleFeedLayout';
import ThreadFeed from '../components/Cards/ThreadLayouts/ThreadFeedLayout';
import TopTopicArticles from '../components/TopicPage/TopTopicArticles';
import TopTopicThreads from '../components/TopicPage/TopTopicThreads';
import {BASE_URL} from '../api/config';

interface ArticleDto {
    _id: string;
    source: string;
    title: string;
    description?: string;
    published: string;
    author?: string;
    image?: string;
    topics: string[];
}

interface ThreadDto {
    _id: string;
    title: string;
    last_updated: string;
    articles: string[];
}

type ArticleFeedLayout = {
    id: string;
    topic: string;
    title: string;
    image: string;
    author: string;
    date: string;
    site: string;
    description: string;
    comments: number;
    views: number;
    rawDate: string;
    isThread: false;
};

type ThreadFeedLayout = {
    id: string;
    threadTitle: string;
    lastUpdated: string;
    articles: ArticleFeedLayout[];
    rawDate: string;
    isThread: true;
};

type CombinedItem = ArticleFeedLayout | ThreadFeedLayout;

const PAGE_SIZE = 10;

const TopicPage: React.FC = () => {
    const {topic} = useParams<{ topic: string }>();
    const [page, setPage] = useState(1);
    const [fullCount, setFullCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [feed, setFeed] = useState<CombinedItem[]>([]);
    const [isFavorite, setIsFavorite] = useState(false);

    const toggleFavorite = () => setIsFavorite(f => !f);

    useEffect(() => {
        if (!topic) return;
        loadFeed();
    }, [topic, page]);

    async function loadFeed() {
        setLoading(true);
        try {
            const url =
                `${BASE_URL}/feed?feed_type=both` +
                `&topics=${encodeURIComponent(topic!)}` +
                `&page=${page}&size=${PAGE_SIZE}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(res.statusText);

            const {articles: aDtos, threads: tDtos} = (await res.json()) as {
                articles: ArticleDto[];
                threads: ThreadDto[];
            };

            const arts: ArticleFeedLayout[] = aDtos.map(a => ({
                id: a._id,
                topic: a.topics[0] || 'General',
                title: a.title,
                image: a.image || '',
                author: a.author || 'Unknown',
                date: new Date(a.published).toLocaleDateString(),
                site: a.source,
                description: a.description || '',
                comments: 0,
                views: 0,
                rawDate: a.published,
                isThread: false,
            }));

            const ths: ThreadFeedLayout[] = await Promise.all(
                tDtos
                    .filter(t => t.articles.length >= 2)
                    .map(async t => {
                        const previews: ArticleFeedLayout[] = await Promise.all(
                            t.articles.slice(0, 3).map(async aid => {
                                const rr = await fetch(`${BASE_URL}/articles/${aid}`);
                                const art = (await rr.json()) as ArticleDto;
                                return {
                                    id: art._id,
                                    topic: art.topics[0] || 'General',
                                    title: art.title,
                                    image: art.image || '',
                                    author: art.author || 'Unknown',
                                    date: new Date(art.published).toLocaleDateString(),
                                    site: art.source,
                                    description: art.description || '',
                                    comments: 0,
                                    views: 0,
                                    rawDate: art.published,
                                    isThread: false,
                                };
                            })
                        );
                        return {
                            id: t._id,
                            threadTitle: t.title,
                            lastUpdated: new Date(t.last_updated).toLocaleDateString(),
                            articles: previews,
                            rawDate: t.last_updated,
                            isThread: true,
                        };
                    })
            );

            const combinedAll: CombinedItem[] = [...arts, ...ths].sort(
                (a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime()
            );
            setFullCount(combinedAll.length);
            setFeed(combinedAll.slice(0, PAGE_SIZE));
        } catch (err) {
            console.error('Error loading topic feed:', err);
            setFeed([]);
        } finally {
            setLoading(false);
        }
    }

    const prevPage = () => setPage(p => Math.max(1, p - 1));
    const nextPage = () => {
        if (fullCount > PAGE_SIZE) setPage(p => p + 1);
    };
    return (
        <div style={{display: 'flex', gap: 24, padding: 16}}>
            <div style={{flex: 7}}>
                <div style={{marginBottom: 8, display: 'inline-flex', alignItems: 'center', gap: 12}}>
                    <TopicTag label={topic || 'General'} style={{fontSize: 18, padding: '6px 10px'}}/>
                    <button
                        onClick={toggleFavorite}
                        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: 22,
                            color: isFavorite ? '#FFD700' : '#888',
                        }}
                    >
                        <FaStar/>
                    </button>
                </div>
                <hr style={{marginBottom: 16}}/>

                {loading ? (
                    <div>Loading…</div>
                ) : (
                    <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
                        {feed.map((item, idx) =>
                            item.isThread ? (
                                <ThreadFeed
                                    key={item.id}
                                    thread={item}
                                    threadIndex={idx}
                                    hoveredItemId={null}
                                    setHoveredItemId={() => {
                                    }}
                                />
                            ) : (
                                <ArticleFeed
                                    key={item.id}
                                    article={item}
                                    id={item.id}
                                    isHovered={false}
                                    onHover={() => {
                                    }}
                                />
                            )
                        )}
                    </div>
                )}

                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 24}}>
                    <button onClick={prevPage} disabled={page === 1}>
                        <FaArrowLeft/> Prev
                    </button>
                    <span>Page {page}</span>
                    <button onClick={nextPage}>
                        Next <FaArrowRight/>
                    </button>
                </div>
            </div>

            <div style={{flex: 3, display: 'flex', flexDirection: 'column', gap: 16}}>
                <TopTopicArticles/>
                <TopTopicThreads/>
            </div>
        </div>
    );
};

export default TopicPage;
