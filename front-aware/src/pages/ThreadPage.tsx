import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {FaComments} from 'react-icons/fa';
import TopicTag from '../components/Cards/Tags/TopicTag';
import ThreadLayout from '../components/ThreadPage/ThreadLayout';
import {BASE_URL} from '../api/config';
import SideArticleListLayout from '../components/Cards/ArticleLayouts/SideArticleListLayout.tsx';

interface RawThread {
    _id: string;
    title: string;
    last_updated: string;
    articles: string[];
}

interface RawArticle {
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

export const ThreadPage: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [thread, setThread] = useState<RawThread | null>(null);
    const [articles, setArticles] = useState<RawArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        if (!id) return;

        const load = async () => {
            try {
                setLoading(true);

                const thrRes = await fetch(`${BASE_URL}/threads/${id}`);
                if (!thrRes.ok) throw new Error(`Thread ${id} not found`);
                const thrJson: RawThread = await thrRes.json();
                setThread(thrJson);

                const arts = await Promise.all(
                    thrJson.articles.map(async aid => {
                        const aRes = await fetch(`${BASE_URL}/articles/${aid}`);
                        if (!aRes.ok) throw new Error(`Article ${aid} failed`);
                        return aRes.json() as Promise<RawArticle>;
                    })
                );
                setArticles(arts);

                const token = localStorage.getItem("authToken");
                if (token) {
                    const res = await fetch(`${BASE_URL}/users/threads-followed`, {
                        headers: {Authorization: `Bearer ${token}`}
                    });
                    const followed = await res.json();
                    const isFollowed = followed.some((t: any) => t._id === id);
                    setIsFollowing(isFollowed);
                }

            } catch (err) {
                console.error('Error loading thread page', err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

    if (loading) return <div>Loading thread…</div>;
    if (!thread) return <div>Thread not found.</div>;

    const mainTopic = articles[0]?.topics[0] || 'General';

    const feedItems = articles.map(a => ({
        topic: a.topics[0] || 'General',
        title: a.title,
        image: a.image || '',
        author: a.author || 'Unknown',
        date: new Date(a.published).toLocaleDateString(),
        site: a.source,
        description: a.description || '',
        commentsCount: a.commentsCount || 0,
        views: a.views || 0,
        id: a._id,
    }));

    const topViewed = [...feedItems]
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);

    const topDiscussed = [...feedItems]
        .sort((a, b) => b.commentsCount - a.commentsCount)
        .slice(0, 5);

    return (
        <div style={{padding: 20}}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 16,
                gap: 8,
                fontSize: 14,
                color: '#031A6B',
                fontWeight: 500,
            }}>
                <Link
                    key="topic"
                    to={`/topic/${encodeURIComponent(mainTopic)}`}
                    style={{textDecoration: 'none', color: '#031A6B', marginRight: 4}}
                >
                    <TopicTag label={mainTopic}/>
                </Link>
                <span>&gt;</span>
                <FaComments size={18}/>
                <span>{thread.title}</span>
            </div>

            <div style={{display: 'flex', gap: 24}}>
                <ThreadLayout
                    threadId={thread._id}
                    threadTitle={thread.title}
                    lastUpdated={new Date(thread.last_updated).toLocaleDateString()}
                    articles={feedItems}
                    initialIsFollowing={isFollowing}
                />

                <div style={{flex: 3}}>
                    <SideArticleListLayout title="Most Viewed in This Thread" articles={topViewed}/>
                    <SideArticleListLayout title="Most Discussed in This Thread" articles={topDiscussed}/>
                </div>
            </div>
        </div>
    );
};

export default ThreadPage;
