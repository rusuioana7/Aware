import React, {useState} from 'react';
import ArticleOptions from '../Cards/ArticleOptions';
import TopicTag from '../Cards/Tags/TopicTag';
import type {ArticleFeedLayout} from '../Cards/ArticleFeedLayout';

type Props = {
    threadTitle: string;
    lastUpdated: string;
    articles: ArticleFeedLayout[];
};

const ThreadLayout: React.FC<Props> = ({threadTitle, lastUpdated, articles}) => {
    const [hoveredArticle, setHoveredArticle] = useState<number | null>(null);

    return (
        <div style={{flex: 7}}>
            <h1 style={{fontSize: '26px', marginBottom: '24px', color: '#031A6B'}}>
                {threadTitle}
                <span style={{fontSize: '16px', fontWeight: 'normal', marginLeft: '12px', color: '#777'}}>
          • Last updated on {lastUpdated}
        </span>
            </h1>

            <div style={{display: 'flex', paddingLeft: '14px'}}>
                <div style={{width: '2px', backgroundColor: '#BDBDBD', marginRight: '28px'}}/>
                <div style={{display: 'flex', flexDirection: 'column', gap: '20px', flex: 1}}>
                    {articles.map((article, idx) => (
                        <div
                            key={idx}
                            style={{display: 'flex', gap: '20px', position: 'relative'}}
                            onMouseEnter={() => setHoveredArticle(idx)}
                            onMouseLeave={() => setHoveredArticle(null)}
                        >
                            {hoveredArticle === idx && (
                                <div style={{position: 'absolute', top: '-12px', right: '0'}}>
                                    <ArticleOptions position="top-right"/>
                                </div>
                            )}

                            <div style={{position: 'absolute', top: '10px', left: '10px', zIndex: 3}}>
                                <TopicTag label={article.topic || 'general'}/>
                            </div>

                            <img
                                src={article.image}
                                alt={article.title}
                                style={{
                                    width: '160px',
                                    height: '110px',
                                    objectFit: 'cover',
                                }}
                            />

                            <div style={{flex: 1}}>
                                <h4 style={{margin: '0 0 6px', fontSize: '18px', fontWeight: 600, color: '#1a1a1a'}}>
                                    {article.title}
                                </h4>

                                <p style={{margin: '0 0 6px', fontSize: '14px', color: '#555'}}>
                                    {article.author} — {article.date} — <span
                                    style={{fontStyle: 'italic'}}>{article.site}</span>
                                </p>

                                <p style={{fontSize: '15px', margin: '6px 0 6px', color: '#333'}}>
                                    {article.description}
                                </p>

                                <p style={{fontSize: '13px', color: '#777'}}>
                                    💬 {article.comments} comments &nbsp;&nbsp; 👁️ {article.views} views
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ThreadLayout;
