import React from 'react';
import {FaComments} from 'react-icons/fa';
import ArticleOptions from './ArticleOptions.tsx';
import type {ArticleFeedLayout} from './ArticleFeedLayout.tsx';
import TopicTag from "./Tags/TopicTag.tsx";

type ThreadFeedLayout = {
    threadTitle: string;
    lastUpdated: string;
    articles: ArticleFeedLayout[];
    isThread: true;
};

type Props = {
    thread: ThreadFeedLayout;
    threadIndex: number;
    hoveredItemId: string | null;
    setHoveredItemId: (id: string | null) => void;
};

const ThreadFeed: React.FC<Props> = ({thread, threadIndex, hoveredItemId, setHoveredItemId}) => {
    const visibleArticles = thread.articles.slice(0, 3);
    const remainingCount = thread.articles.length - visibleArticles.length;

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <FaComments size={20} color="#BDBDBD"/>
                <h2 style={{fontSize: '20px', margin: 0}}>
                    {thread.threadTitle}
                    <span style={{fontSize: '14px', fontWeight: 'normal', marginLeft: '10px', color: '#777'}}>
            • Last updated on {thread.lastUpdated}
          </span>
                </h2>
            </div>
            <div style={{display: 'flex', paddingLeft: '12px'}}>
                <div style={{width: '2px', backgroundColor: '#BDBDBD', marginRight: '25px'}}/>
                <div style={{display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, marginBottom: '-10px'}}>
                    {visibleArticles.map((article, idx) => {
                        const articleId = `thread-${threadIndex}-${idx}`;
                        const isHovered = hoveredItemId === articleId;

                        return (
                            <div
                                key={idx}
                                style={{display: 'flex', gap: '16px', position: 'relative'}}
                                onMouseEnter={() => setHoveredItemId(articleId)}
                                onMouseLeave={() => setHoveredItemId(null)}
                            >
                                {isHovered && (
                                    <div style={{position: 'absolute', top: '-15px', right: '70px'}}>
                                        <ArticleOptions position="top-right"/>
                                    </div>
                                )}
                                <div style={{position: 'absolute', top: '8px', left: '8px', zIndex: 3}}>
                                    <TopicTag label={article.topic || 'general'}/>

                                </div>

                                <img src={article.image} alt={article.title}
                                     style={{width: '140px', height: '100px', objectFit: 'cover'}}/>
                                <div>
                                    <h4 style={{
                                        margin: '0 0 4px',
                                        fontSize: '16px',
                                        fontWeight: 600
                                    }}>{article.title}</h4>
                                    <p style={{margin: '0 0 4px', fontSize: '13px', color: '#555'}}>
                                        {article.author} - {article.date} - <span
                                        style={{fontStyle: 'italic'}}>{article.site}</span>
                                    </p>
                                    <p style={{
                                        fontSize: '14px',
                                        margin: '6px 0 4px',
                                        color: '#333'
                                    }}>{article.description}</p>
                                    <p style={{fontSize: '12px', color: '#777'}}>
                                        💬 {article.comments} comments &nbsp;&nbsp; 👁️ {article.views} views
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    {remainingCount > 0 && (
                        <p style={{fontSize: '15px', color: '#009FFD', fontWeight: 500, marginTop: 0}}>
                            + {remainingCount} more
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ThreadFeed;
