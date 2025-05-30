import React from 'react';
import ArticleOptions from './ArticleOptions.tsx';
import TopicTag from '../Tags/TopicTag.tsx';
import CredibilityLabel from '../Tags/CredibilityLabel.tsx';

export type ArticleFeedLayout = {
    title: string;
    date: string;
    topic: string;
    author: string;
    site: string;
    description: string;
    comments: number;
    views: number;
    image: string;
    credibilityStatus?:  'verified' | 'unknown' | 'suspicious' | 'untrustworthy' | 'under-review';
};

type Props = {
    article: ArticleFeedLayout;
    id: string;
    isHovered: boolean;
    onHover: (id: string | null) => void;
};


const ArticleFeed: React.FC<Props> = ({article, id, isHovered, onHover}) => (
    <div
        style={{display: 'flex', gap: '16px', alignItems: 'flex-start', position: 'relative'}}
        onMouseEnter={() => onHover(id)}
        onMouseLeave={() => onHover(null)}
    >
        <div style={{position: 'relative', width: '140px', height: '100px'}}>
            <img
                src={article.image}
                alt={article.title}
                style={{width: '100%', height: '100%', objectFit: 'cover'}}
            />

            {isHovered && (
                <div style={{position: 'absolute', top: '6px', right: '6px', zIndex: 2}}>
                    <ArticleOptions position="top-right"/>
                </div>
            )}

            <div style={{position: 'absolute', top: '6px', left: '6px', zIndex: 2}}>
                <TopicTag label={article.topic || 'general'}/>
            </div>
        </div>

        <div style={{flex: 1}}>
            <h3 style={{margin: '0 0 6px', fontSize: '18px', fontWeight: 600}}>{article.title}</h3>
            <p style={{margin: '0 0 4px', fontSize: '14px', color: '#555'}}>
                {article.author} - {article.date} - <span style={{fontStyle: 'italic'}}>{article.site}</span>
            </p>
            <p style={{fontSize: '15px', margin: '6px 0 8px', color: '#333'}}>{article.description}</p>
            <p style={{fontSize: '13px', color: '#777', display: 'flex', alignItems: 'center'}}>
                💬 {article.comments} comments &nbsp;&nbsp; 👁️ {article.views} views
                {article.credibilityStatus && <CredibilityLabel status={article.credibilityStatus}/>}
            </p>

        </div>
    </div>
);

export default ArticleFeed;
