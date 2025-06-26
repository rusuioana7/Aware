import React from 'react';
import {Link} from 'react-router-dom';
import ArticleOptions from './ArticleOptions';
import TopicTag from '../Tags/TopicTag';
import CredibilityLabel from "../Tags/CredibilityLabel.tsx";

export type ArticleFeedLayout = {
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

interface Props {
    article: ArticleFeedLayout;
    id: string;
    isHovered: boolean;
    onHover: (id: string | null) => void;
}

const ArticleFeed: React.FC<Props> = ({article, id, isHovered, onHover}) => (
    <Link
        to={`/article/${article.id}`}
        style={{textDecoration: 'none', color: 'inherit'}}
    >
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
                    <div
                        style={{position: 'absolute', top: '6px', right: '6px', zIndex: 2}}
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                    >
                        <ArticleOptions articleId={article.id} position="top-right"/>
                    </div>
                )}


                <div style={{position: 'absolute', top: '6px', left: '6px', zIndex: 2}}>
                    <TopicTag label={article.topic || 'general'}/>
                </div>
            </div>

            <div style={{flex: 1}}>
                <h3 style={{margin: '0 0 6px', fontSize: '18px', fontWeight: 600}}>
                    {article.title}
                </h3>
                <p style={{margin: '0 0 4px', fontSize: '14px', color: '#555'}}>
                    {article.author} - {article.date} -{' '}
                    <span style={{fontStyle: 'italic'}}>{article.site}</span>
                </p>
                <p style={{fontSize: '15px', margin: '6px 0 8px', color: '#333'}}>
                    {article.description}
                </p>
                <p style={{
                    fontSize: '13px',
                    color: '#777',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexWrap: 'wrap'
                }}>
                    💬 {typeof article.commentsCount === 'number' ? article.commentsCount : 0} comments
                    👁️ {typeof article.views === 'number' ? article.views : 0} views
                    {article.credibility_label && <CredibilityLabel level={article.credibility_label}/>}
                </p>

            </div>
        </div>
    </Link>
);

export default ArticleFeed;
