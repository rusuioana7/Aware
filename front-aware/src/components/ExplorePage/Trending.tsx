import React, {useState} from 'react';
import TopicTag from '../Cards/Tags/TopicTag';
import {TOPIC_COLORS} from '../Cards/Tags/TagColor';
import ArticleFeed from '../Cards/ArticleLayouts/ArticleFeedLayout.tsx';

const sampleArticles = [
    {
        id: '1',
        title: 'AI Breakthrough Promises to Revolutionize Medicine',
        date: 'May 21, 2025',
        topic: 'travel',
        author: 'Dr. Elena Gomez',
        site: 'HealthTech Daily',
        description: 'A new AI model outperforms doctors in diagnosing rare diseases...',
        comments: 42,
        views: 10500,
        image: '/news2.jpg',
    },
    {
        id: '2',
        title: 'Electric Cars Surpass Gas Vehicles in Europe',
        date: 'May 19, 2025',
        topic: 'travel',
        author: 'Marcus Leung',
        site: 'Eco Mobility News',
        description: 'EVs now account for over 55% of new vehicle sales in Europe...',
        comments: 28,
        views: 8900,
        image: '/news2.jpg',
    },
    {
        id: '3',
        title: 'NASA Unveils New Moon Mission Timeline',
        date: 'May 18, 2025',
        topic: 'travel',
        author: 'Ava Singh',
        site: 'Science Frontier',
        description: 'The Artemis program plans to land the next astronauts by 2027...',
        comments: 17,
        views: 7200,
        image: '/news2.jpg',
    },
    {
        id: '4',
        title: 'NASA Unveils New Moon Mission Timeline',
        date: 'May 18, 2025',
        topic: 'travel',
        author: 'Ava Singh',
        site: 'Science Frontier',
        description: 'The Artemis program plans to land the next astronauts by 2027...',
        comments: 17,
        views: 7200,
        image: '/news2.jpg',
    },
    {
        id: '5',
        title: 'NASA Unveils New Moon Mission Timeline',
        date: 'May 18, 2025',
        topic: 'travel',
        author: 'Ava Singh',
        site: 'Science Frontier',
        description: 'The Artemis program plans to land the next astronauts by 2027...',
        comments: 17,
        views: 7200,
        image: '/news2.jpg',
    },
    {
        id: '5',
        title: 'NASA Unveils New Moon Mission Timeline',
        date: 'May 18, 2025',
        topic: 'travel',
        author: 'Ava Singh',
        site: 'Science Frontier',
        description: 'The Artemis program plans to land the next astronauts by 2027...',
        comments: 17,
        views: 7200,
        image: '/news2.jpg',
    },
    {
        id: '5',
        title: 'NASA Unveils New Moon Mission Timeline',
        date: 'May 18, 2025',
        topic: 'travel',
        author: 'Ava Singh',
        site: 'Science Frontier',
        description: 'The Artemis program plans to land the next astronauts by 2027...',
        comments: 17,
        views: 7200,
        image: '/news2.jpg',
    },
];

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


const Trending: React.FC = () => {

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
    const [hoveredId, setHoveredId] = useState<string | null>(null);

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
                    <h2 style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        marginTop: '10px',
                    }}>
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
                <div style={{marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '24px', marginRight: '50px'}}>
                    {sampleArticles.map((article) => (
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
