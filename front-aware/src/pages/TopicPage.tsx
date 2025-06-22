// src/pages/TopicPage.tsx

import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {FaArrowLeft, FaArrowRight, FaStar} from 'react-icons/fa';
import TopicTag from '../components/Cards/Tags/TopicTag';
import ArticleFeed from '../components/Cards/ArticleLayouts/ArticleFeedLayout';
import ThreadFeed from '../components/Cards/ThreadLayouts/ThreadFeedLayout';
import TopTopicArticles from '../components/TopicPage/TopTopicArticles';
import TopTopicThreads from '../components/TopicPage/TopTopicThreads';
import SelectSort from '../components/Cards/SelectMenu/SelectSort';
import SelectView from '../components/Cards/SelectMenu/SelectView';

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
    views?: number;
    commentsCount?: number;
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
    commentsCount: number;
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
    const [allItems, setAllItems] = useState<CombinedItem[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [userFavorites, setUserFavorites] = useState<string[]>([]);
    const [selectedSort, setSelectedSort] = useState<'Newest' | 'Popular' | 'Verified Only'>('Newest');
    const [selectedView, setSelectedView] = useState<'All' | 'Articles' | 'Threads'>('All');


    const toggleFavorite = () => setIsFavorite(f => !f);

    useEffect(() => {
        if (!topic) return;

        const fetchAll = async () => {
            setLoading(true);
            try {
                const accumulated: CombinedItem[] = [];
                let pageNum = 1;

                while (true) {
                    const url =
                        `${BASE_URL}/feed?feed_type=both` +
                        `&topics=${encodeURIComponent(topic)}` +
                        `&page=${pageNum}&size=${PAGE_SIZE}`;
                    const res = await fetch(url);
                    if (!res.ok) throw new Error(`Page ${pageNum} failed: ${res.statusText}`);
                    const {articles: aDtos, threads: tDtos} = (await res.json()) as {
                        articles: ArticleDto[];
                        threads: ThreadDto[];
                    };

                    if (aDtos.length === 0 && tDtos.length === 0) break;

                    const arts: ArticleFeedLayout[] = aDtos.map(a => ({
                        id: a._id,
                        topic: a.topics[0] || 'General',
                        title: a.title,
                        image: a.image || '',
                        author: a.author || 'Unknown',
                        date: new Date(a.published).toLocaleDateString(),
                        site: a.source,
                        description: a.description || '',
                        commentsCount: a.commentsCount || 0,
                        views: a.views || 0,
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
                                            commentsCount: art.commentsCount || 0,
                                            views: art.views || 0,
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

                    const combinedPage = [...arts, ...ths].sort(
                        (a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime()
                    );

                    accumulated.push(...combinedPage);
                    pageNum++;
                }

                setAllItems(accumulated);
                setPage(1);
            } catch (err) {
                console.error('Error loading topic feed:', err);
                setAllItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [topic]);

    useEffect(() => {
        const fetchFavorites = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            try {
                const res = await fetch(`${BASE_URL}/users/me`, {
                    headers: {Authorization: `Bearer ${token}`},
                });
                const user = await res.json();
                const topics = (user.favoriteTopics || []).map((t: string) => t.toLowerCase());
                setUserFavorites(topics);
            } catch (err) {
                console.error('Failed to fetch user favorites:', err);
            }
        };

        fetchFavorites();
    }, []);

    useEffect(() => {
        if (topic) {
            const lower = topic.toLowerCase();
            setIsFavorite(userFavorites.includes(lower));
        }
    }, [topic, userFavorites]);


    const filteredItems = allItems.filter(item => {
        if (selectedView === 'Articles') return !item.isThread;
        if (selectedView === 'Threads') return item.isThread;
        return true;
    });

    const sortedItems = [...filteredItems].sort((a, b) => {
        if (selectedSort === 'Newest') {
            return new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime();
        } else if (selectedSort === 'Popular') {
            const aViews = a.isThread ? Math.max(...a.articles.map(art => art.views)) : a.views;
            const bViews = b.isThread ? Math.max(...b.articles.map(art => art.views)) : b.views;
            return bViews - aViews;
        }
        return 0;
    });

    const paginated = sortedItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const totalPages = Math.ceil(sortedItems.length / PAGE_SIZE);


    const prevPage = () => setPage(p => Math.max(1, p - 1));
    const nextPage = () => {
        if (allItems.length > PAGE_SIZE * page) {
            setPage(p => p + 1);
        }
    };

    useEffect(() => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }, [page]);

    return (
        <div style={{display: 'flex', gap: 24, padding: 16}}>
            {/* Main column */}
            <div style={{flex: 7}}>
                <div style={{marginBottom: 0, display: 'inline-flex', alignItems: 'center', gap: 8}}>
                    <TopicTag label={topic || 'General'} style={{fontSize: 18, padding: '6px 10px'}}/>
                    <button
                        onClick={toggleFavorite}
                        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: 25,
                            marginTop: 10,
                            color: isFavorite ? '#FFD700' : '#888',
                        }}
                    >
                        <FaStar/>
                    </button>
                </div>
                <hr style={{marginBottom: 16}}/>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 60,
                    flexWrap: 'wrap',
                    marginBottom: 20,
                }}>
                    <SelectSort
                        options={['Newest', 'Popular']}
                        selected={selectedSort}
                        onSelect={setSelectedSort}
                    />
                    <SelectView
                        options={['All', 'Articles', 'Threads']}
                        selected={selectedView}
                        onSelect={setSelectedView}
                    />
                </div>


                {loading ? (
                    <div>Loading all pages…</div>
                ) : (
                    <>
                        <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
                            {paginated.map((item, idx) =>
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

            {/* Sidebar */}
            <div style={{flex: 3, display: 'flex', flexDirection: 'column', gap: 16}}>
                <TopTopicArticles/>
                <TopTopicThreads/>
            </div>
        </div>
    );
};

export default TopicPage;
