import React from 'react';
import ArticleOptions from './ArticleOptions.tsx';
import TopicTag from "./Tags/TopicTag.tsx";

export type ArticleLayout = {
    title: string;
    date: string;
    topic: string;
    author: string;
    site: string;
    description: string;
    comments: number;
    views: number;
    image: string;
};

type Props = {
    article: ArticleLayout;
    id: string;
    isHovered: boolean;
    onHover: (id: string | null) => void;
};

const Article: React.FC<Props> = ({article, id, isHovered, onHover}) => (
    <div
        style={{display: 'flex', gap: '16px', alignItems: 'flex-start', position: 'relative'}}
        onMouseEnter={() => onHover(id)}
        onMouseLeave={() => onHover(null)}
    >
        {isHovered && (
            <div style={{position: 'absolute', top: '-15px', right: '10px'}}>
                <ArticleOptions position="top-right"/>
            </div>
        )}
        <div style={{position: 'absolute', top: '8px', left: '8px', zIndex: 3}}>
            <TopicTag label={article.topic || 'general'}/>

        </div>
        <img src={article.image} alt={article.title} style={{width: '140px', height: '100px', objectFit: 'cover'}}/>
        <div>
            <h3 style={{margin: '0 0 6px', fontSize: '18px', fontWeight: 600}}>{article.title}</h3>
            <p style={{margin: '0 0 4px', fontSize: '14px', color: '#555'}}>
                {article.author} - {article.date} - <span style={{fontStyle: 'italic'}}>{article.site}</span>
            </p>
            <p style={{fontSize: '15px', margin: '6px 0 8px', color: '#333'}}>{article.description}</p>
            <p style={{fontSize: '13px', color: '#777'}}>
                💬 {article.comments} comments &nbsp;&nbsp; 👁️ {article.views} views
            </p>
        </div>
    </div>
);

export default Article;
