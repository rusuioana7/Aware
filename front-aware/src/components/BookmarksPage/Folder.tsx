import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import ArticleFeed, {type ArticleFeedLayout} from '../Cards/ArticleLayouts/ArticleFeedLayout.tsx';
import ThreadFeed from '../Cards/ThreadLayouts/ThreadFeedLayout.tsx';
import {BASE_URL} from '../../api/config';

type Props = {
    folderId: string;
};

interface RawArticle {
    _id: string;
    title: string;
    published: string;
    topics?: string[];
    author?: string;
    source?: string;
    description?: string;
    commentsCount?: number;
    views?: number;
    image?: string;
}

interface ThreadDto {
    _id: string;
    title: string;
    articles: string[];
    last_updated: string;
}

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

const Folder: React.FC<Props> = ({folderId}) => {
    const [articles, setArticles] = useState<ArticleFeedLayout[]>([]);
    const [threads, setThreads] = useState<
        {
            id: string;
            threadTitle: string;
            lastUpdated: string;
            articles: ArticleFeedLayout[];
        }[]
    >([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            try {
                setLoading(true);
                const res = await fetch(`${BASE_URL}/bookmarks/${folderId}`, {
                    headers: {Authorization: `Bearer ${token}`},
                });

                const data: { articles: RawArticle[]; threads: ThreadDto[] } = await res.json();

                const articleIdsInThreads = new Set(data.threads.flatMap((t) => t.articles));

                const parsedArticles: ArticleFeedLayout[] = data.articles
                    .filter((a) => !articleIdsInThreads.has(a._id))
                    .map((a) => ({
                        id: a._id,
                        title: a.title,
                        date: formatDate(a.published),
                        topic: a.topics?.[0] || '',
                        author: a.author || '',
                        site: a.source || '',
                        description: a.description || '',
                        commentsCount: a.commentsCount || 0,
                        views: a.views || 0,
                        image: a.image || '',
                    }));

                const parsedThreads = await Promise.all(
                    data.threads.map(async (t) => {
                        const previews: ArticleFeedLayout[] = await Promise.all(
                            t.articles.slice(0, 3).map(async (aid) => {
                                const aRes = await fetch(`${BASE_URL}/articles/${aid}`);
                                const a: RawArticle = await aRes.json();
                                return {
                                    id: a._id,
                                    title: a.title,
                                    date: formatDate(a.published),
                                    topic: a.topics?.[0] || '',
                                    author: a.author || '',
                                    site: a.source || '',
                                    description: a.description || '',
                                    commentsCount: a.commentsCount || 0,
                                    views: a.views || 0,
                                    image: a.image || '',
                                };

                            })
                        );

                        return {
                            id: t._id,
                            threadTitle: t.title,
                            lastUpdated: formatDate(t.last_updated),
                            articles: previews.filter((a): a is ArticleFeedLayout => a !== null),
                        };
                    })
                );

                setArticles(parsedArticles);
                setThreads(parsedThreads);
            } catch (err) {
                console.error('Failed to load folder content:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [folderId]);

    return (
        <div style={{marginLeft: '20px'}}>
            {loading ? (
                <p style={{padding: '1rem', color: '#666'}}>Loading content...</p>
            ) : threads.length + articles.length === 0 ? (
                <p>No items in this folder.</p>
            ) : (
                <>
                    {threads.map((t) => (
                        <Link key={t.id} to={`/thread/${t.id}`} style={{textDecoration: 'none', color: 'inherit'}}>
                            <ThreadFeed
                                thread={{...t, isThread: true}}
                                threadIndex={0}
                                hoveredItemId={null}
                                setHoveredItemId={() => {
                                }}
                            />
                        </Link>
                    ))}

                    {articles.map((a, i) => (
                        <Link key={a.id} to={`/article/${a.id}`} style={{textDecoration: 'none', color: 'inherit'}}>
                            <ArticleFeed
                                id={`${folderId}-article-${i}`}
                                article={a}
                                isHovered={false}
                                onHover={() => {
                                }}
                            />
                        </Link>
                    ))}
                </>
            )}
        </div>
    );
};

export default Folder;
