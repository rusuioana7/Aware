import React, {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {BASE_URL} from '../../api/config';
import ArticleFeed from '../Cards/ArticleLayouts/ArticleFeedLayout';
import ThreadFeed from '../Cards/ThreadLayouts/ThreadFeedLayout';
import SearchBar from './SearchBar';
import SelectSort from '../Cards/SelectMenu/SelectSort';
import SelectView from '../Cards/SelectMenu/SelectView';

type ArticleFeedLayout = {
    id: string;
    title: string;
    date: string;
    topic: string;
    author: string;
    site: string;
    description: string;
    views: number;
    commentsCount?: number;
    image: string;
    credibility_label?: string;
};

type ThreadFeedLayout = {
    id: string;
    threadTitle: string;
    lastUpdated: string;
    rawDate: string;
    isThread: true;
    articles: ArticleFeedLayout[];
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

const SearchResults: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [results, setResults] = useState<{
        articles: ArticleFeedLayout[];
        threads: ThreadFeedLayout[]
    }>({articles: [], threads: []});
    const [loading, setLoading] = useState(false);
    const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

    const view = searchParams.get('view') || 'both';
    const sort = searchParams.get('sort') || 'published';
    const page = parseInt(searchParams.get('page') || '1');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);

    const handleSearchSubmit = () => {
        const params = new URLSearchParams(searchParams);
        if (searchQuery.trim()) {
            params.set('q', searchQuery.trim());
            params.set('page', '1');
        } else {
            params.delete('q');
        }
        setSearchParams(params);
    };

    const updateParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set(key, value);
        if (key !== 'page') {
            params.set('page', '1');
        }
        setSearchParams(params);
    };

    const changePage = (delta: number) => {
        const newPage = Math.max(1, page + delta);
        updateParam('page', newPage.toString());
    };

    useEffect(() => {
        const query = searchParams.get('q');
        if (!query) return;

        const fetchResults = async () => {
            setLoading(true);
            const token = localStorage.getItem('authToken');

            try {
                const params = new URLSearchParams({
                    q: query,
                    view,
                    sort,
                    topics: searchParams.get('topics') || '',
                    page: page.toString(),
                    size: '10',
                });

                const res = await fetch(`${BASE_URL}/search?${params.toString()}`, {
                    headers: {Authorization: `Bearer ${token}`},
                });

                const data: { articles?: RawArticle[]; threads?: RawThread[] } = await res.json();

                const articleMap = new Map<string, ArticleFeedLayout>();
                const articles: ArticleFeedLayout[] = (data.articles || []).map((a) => {
                    const mapped = {
                        id: a._id,
                        title: a.title,
                        date: new Date(a.published).toLocaleDateString(),
                        topic: (a.topic || a.topics?.[0] || 'general').toLowerCase(),
                        author: a.author || 'Unknown',
                        site: a.source,
                        description: a.description || '',
                        views: a.views || 0,
                        commentsCount: a.commentsCount || 0,
                        image: a.image || '',
                        credibility_label: a.credibility_label || '',
                    };
                    articleMap.set(a._id, mapped);
                    return mapped;
                });

                const threads: ThreadFeedLayout[] = (data.threads || []).map((t) => {
                    const resolvedArticles = (t.articles || [])
                        .map((id) => articleMap.get(id))
                        .filter(Boolean) as ArticleFeedLayout[];

                    return {
                        id: t._id,
                        threadTitle: t.title,
                        lastUpdated: new Date(t.last_updated).toLocaleDateString(),
                        rawDate: t.last_updated,
                        isThread: true,
                        articles: resolvedArticles,
                    };
                });

                const threadArticleIds = new Set(threads.flatMap((t) => t.articles.map((a) => a.id)));
                const standaloneArticles = articles.filter((a) => !threadArticleIds.has(a.id));

                setResults({
                    articles: view === 'threads' ? [] : standaloneArticles,
                    threads,
                });
            } catch (err) {
                console.error('[SearchResults] Fetch failed:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [searchParams]);

    return (
        <div style={{padding: 20}}>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px',
                flexWrap: 'wrap'
            }}>
                <SearchBar
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onSearch={handleSearchSubmit}
                    placeholder="Search articles, threads..."
                />
            </div>

            <div style={{display: 'flex', gap: '20px', marginBottom: '25px', justifyContent: 'center'}}>

                <SelectSort
                    options={['Newest', 'Popular']}
                    selected={
                        sort === 'views' ? 'Popular' :

                            'Newest'
                    }
                    onSelect={(val) => {
                        const map: Record<string, string> = {
                            'Newest': 'published',
                            'Popular': 'views',

                        };
                        updateParam('sort', map[val]);
                    }}
                />
                <SelectView
                    options={['All', 'Articles', 'Threads']}
                    selected={view === 'both' ? 'All' : view.charAt(0).toUpperCase() + view.slice(1) as 'Articles' | 'Threads'}
                    onSelect={(val) => updateParam('view', val === 'All' ? 'both' : val.toLowerCase())}
                />
            </div>

            <h2 style={{marginBottom: 16}}>
                Search results for: <i>{searchParams.get('q') || ''}</i>
            </h2>

            {loading && <p>Loading...</p>}

            {!loading && results.articles.length === 0 && results.threads.length === 0 && (
                <p>No results found.</p>
            )}

            {results.articles.map((article) => (
                <ArticleFeed
                    key={article.id}
                    article={article}
                    id={article.id}
                    isHovered={hoveredItemId === article.id}
                    onHover={setHoveredItemId}
                />
            ))}

            {results.threads.map((thread, idx) => (
                <ThreadFeed
                    key={thread.id}
                    thread={thread}
                    threadIndex={idx}
                    hoveredItemId={hoveredItemId}
                    setHoveredItemId={setHoveredItemId}
                />
            ))}

            {/* Pagination */}
            <div style={{marginTop: 30, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20}}>
                <button
                    onClick={() => changePage(-1)}
                    disabled={page <= 1}
                    style={{
                        padding: '8px 16px',
                        borderRadius: 6,
                        backgroundColor: '#031A6B',
                        color: 'white',
                        border: 'none',
                        cursor: page > 1 ? 'pointer' : 'not-allowed',
                        opacity: page > 1 ? 1 : 0.5,
                    }}
                >
                    Previous
                </button>

                <span style={{fontSize: 16, fontWeight: 500}}>Page {page}</span>

                <button
                    onClick={() => changePage(1)}
                    style={{
                        padding: '8px 16px',
                        borderRadius: 6,
                        backgroundColor: '#031A6B',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    Next
                </button>
            </div>

        </div>
    );
};

export default SearchResults;
