import React from 'react';
import TopicTag from '../Cards/Tags/TopicTag';
import {TOPIC_COLORS} from '../Cards/Tags/TagColor';
import ArticleFeed from '../Cards/ArticleLayouts/ArticleFeedLayout.tsx';

export type Article = {
    id: string;
    title: string;
    date: string;
    topic: string;
    author: string;
    site: string;
    description: string;
    comments: number;
    views: number;
    image: string;
    credibilityStatus?: 'verified' | 'unknown' | 'suspicious' | 'untrustworthy' | 'under-review'

};

const Trending: React.FC<{ articles: Article[] }> = ({articles}) => {
    const trendingTopics = [
        'AI revolution in 2025',
        'Election results',
        'SpaceX Mars Launch',
        'New iPhone leaks',
        'Stock market surge',
        'Stock market surge',
        'Stock market surge',
        'Stock market surge',
        'Stock market surge',
        'Stock market surge',
    ];

    const [hoveredId, setHoveredId] = React.useState<string | null>(null);

    const getCategory = (topic: string) => {
        if (topic.toLowerCase().includes('ai')) return 'Technology';
        if (topic.toLowerCase().includes('election')) return 'Politics';
        if (topic.toLowerCase().includes('mars') || topic.toLowerCase().includes('spacex')) return 'Science';
        if (topic.toLowerCase().includes('iphone')) return 'Tech';
        if (topic.toLowerCase().includes('stock')) return 'Finance';
        return 'General';
    };

    const generatePostCount = () => {
        const count = (Math.random() * 10000 + 3000).toFixed(0);
        return `${Number(count).toLocaleString()}K`;
    };

    return (
        <div style={{display: 'flex', gap: '20px', padding: '0 15px'}}>
            <div style={{flex: 7}}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginTop: '15px',
                }}>
                    <h2 style={{fontSize: '18px', fontWeight: 'bold', marginTop: '10px'}}>
                        Popular Categories:
                    </h2>

                    {Object.keys(TOPIC_COLORS)
                        .filter(k => k !== 'all' && k !== 'general')
                        .slice(0, 8)
                        .map((key) => (
                            <TopicTag
                                key={key}
                                label={key}
                                style={{
                                    fontSize: '14px',
                                    padding: '8px 16px',
                                    fontWeight: 'bold',
                                }}
                            />
                        ))}
                </div>

                <div style={{
                    marginTop: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    marginRight: '50px'
                }}>
                    {articles.map((article) => (
                        <ArticleFeed
                            key={article.id}
                            article={article}
                            id={article.id}
                            isHovered={hoveredId === article.id}
                            onHover={setHoveredId}
                        />
                    ))}
                </div>
            </div>

            <div style={{flex: 3}}>
                <h2 style={{fontSize: '22px', marginBottom: '10px'}}>Trending Now</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    {trendingTopics.map((topic, index) => (
                        <div key={index} style={{padding: '8px 0', borderBottom: '1px solid #e0e0e0'}}>
                            <div style={{fontSize: '15px', color: '#555'}}>
                                #{index + 1} · {getCategory(topic)}
                            </div>
                            <div style={{fontWeight: 'bold', fontSize: '18px', margin: '2px 0'}}>
                                {topic}
                            </div>
                            <div style={{fontSize: '16px', color: '#777'}}>
                                {generatePostCount()} posts
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Trending;
