import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import ArticleOptions from '../Cards/ArticleLayouts/ArticleOptions.tsx';
import TopicTag from '../Cards/Tags/TopicTag.tsx';
import type {ArticleFeedLayout} from '../Cards/ArticleLayouts/ArticleFeedLayout.tsx';
import {BASE_URL} from '../../api/config.ts';
import CredibilityLabel from "../Cards/Tags/CredibilityLabel.tsx";

type Props = {
    threadId: string;
    threadTitle: string;
    lastUpdated: string;
    articles: ArticleFeedLayout[];
    initialIsFollowing: boolean;
};

const ThreadLayout: React.FC<Props> = ({
                                           threadId,
                                           threadTitle,
                                           lastUpdated,
                                           articles,
                                           initialIsFollowing
                                       }) => {
    const [hoveredArticle, setHoveredArticle] = useState<number | null>(null);
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [loadingFollow, setLoadingFollow] = useState(false);

    const toggleFollow = async () => {
        const token = localStorage.getItem("authToken");
        if (!token || !threadId) return;

        setLoadingFollow(true);

        try {
            const method = isFollowing ? "DELETE" : "POST";
            const url = `${BASE_URL}/users/threads/${threadId}/${isFollowing ? "unfollow" : "follow"}`;

            await fetch(url, {
                method,
                headers: {Authorization: `Bearer ${token}`}
            });

            setIsFollowing(prev => !prev);
        } catch (err) {
            console.error("Failed to toggle follow:", err);
        } finally {
            setLoadingFollow(false);
        }
    };

    return (
        <div style={{flex: 7}}>
            <h1
                style={{
                    fontSize: '26px',
                    marginBottom: '24px',
                    color: '#031A6B',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                }}
            >
                {threadTitle}
                <span style={{fontSize: '16px', fontWeight: 'normal', color: '#777'}}>
                    • Last updated on {lastUpdated} •
                </span>

                <button
                    onClick={toggleFollow}
                    disabled={loadingFollow}
                    style={{
                        cursor: 'pointer',
                        padding: '6px 14px',
                        fontSize: '14px',
                        fontWeight: '600',
                        borderRadius: '4px',
                        border: '1.5px solid #031A6B',
                        backgroundColor: isFollowing ? '#031A6B' : '#fff',
                        color: isFollowing ? '#fff' : '#031A6B',
                        transition: 'all 0.3s ease',
                        userSelect: 'none',
                        opacity: loadingFollow ? 0.6 : 1
                    }}
                    aria-pressed={isFollowing}
                    aria-label={isFollowing ? 'Unfollow thread' : 'Follow thread'}
                >
                    {isFollowing ? 'Following' : '+ Follow'}
                </button>
            </h1>

            <div style={{display: 'flex', paddingLeft: '14px'}}>
                <div style={{width: '2px', backgroundColor: '#BDBDBD', marginRight: '28px'}}/>
                <div style={{display: 'flex', flexDirection: 'column', gap: '20px', flex: 1}}>
                    {articles.map((article, idx) => (
                        <Link
                            key={article.id}
                            to={`/article/${article.id}`}
                            onMouseEnter={() => setHoveredArticle(idx)}
                            onMouseLeave={() => setHoveredArticle(null)}
                            style={{
                                display: 'flex',
                                gap: '20px',
                                position: 'relative',
                                textDecoration: 'none',
                                color: 'inherit',
                                cursor: 'pointer',
                            }}
                        >
                            <div style={{position: 'relative'}}>
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    style={{
                                        width: '160px',
                                        height: '110px',
                                        objectFit: 'cover',
                                        display: 'block',
                                    }}
                                />
                                {hoveredArticle === idx && (
                                    <div
                                        style={{position: 'absolute', top: '6px', right: '6px', zIndex: 10}}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                        }}
                                    >
                                        <ArticleOptions articleId={article.id} position="top-right"/>
                                    </div>
                                )}

                            </div>

                            <div style={{position: 'absolute', top: '10px', left: '10px', zIndex: 3}}>
                                <TopicTag label={article.topic || 'general'}/>
                            </div>

                            <div style={{flex: 1, minWidth: 0}}>
                                <h4 style={{margin: '0 0 6px', fontSize: '18px', fontWeight: 600, color: '#1a1a1a'}}>
                                    {article.title}
                                </h4>

                                <p style={{margin: '0 0 6px', fontSize: '14px', color: '#555'}}>
                                    {article.author} — {article.date} —{' '}
                                    <span style={{fontStyle: 'italic'}}>{article.site}</span>
                                </p>

                                <p style={{fontSize: '15px', margin: '6px 0 6px', color: '#333'}}>
                                    {article.description}
                                </p>

                                <p style={{fontSize: '13px', color: '#777'}}>
                                    💬 {typeof article.commentsCount === 'number' ? article.commentsCount : 0} comments &nbsp;
                                    👁️ {typeof article.views === 'number' ? article.views : 0} views
                                    {article.credibility_label && (
                                        <CredibilityLabel level={article.credibility_label}/>
                                    )}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ThreadLayout;
