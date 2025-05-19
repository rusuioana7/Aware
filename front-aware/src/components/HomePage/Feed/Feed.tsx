import React, {useState} from 'react';
import {FaComments} from 'react-icons/fa';
import ArticleOptions from "../ArticleOptions.tsx";

type Article = {
    title: string;
    date: string;
    author: string;
    site: string;
    description: string;
    comments: number;
    views: number;
    image: string;
};

type Thread = {
    threadTitle: string;
    lastUpdated: string;
    articles: Article[];
    isThread: true;
};

type FeedItem = Article | Thread;

type FeedProps = {
    selectedView: 'All' | 'Articles' | 'Threads';
};

const feedItems: FeedItem[] = [
    {
        title: 'Breakthrough in Quantum Computing',
        date: '18 May 2025',
        author: 'Elena Maxwell',
        site: 'ScienceDaily',
        description: 'Researchers have made a significant leap in quantum processing power, opening new doors for tech innovation.',
        comments: 23,
        views: 1052,
        image: '/news1.jpg',
    },
    {
        isThread: true,
        threadTitle: 'The Future of Renewable Energy',
        lastUpdated: '17 May 2025',
        articles: [
            {
                title: 'Major Advancements in Renewable Energy',
                date: '17 May 2025',
                author: 'Thomas Weller',
                site: 'GreenFuture',
                description: 'The latest innovations in solar and wind tech may soon replace traditional fossil fuels on a large scale.',
                comments: 41,
                views: 2379,
                image: '/news2.jpg',
            },
            {
                title: 'How Countries are Adopting Clean Power',
                date: '16 May 2025',
                author: 'Nina Kumar',
                site: 'EcoNews',
                description: 'Governments worldwide are making strategic moves toward energy independence and clean power.',
                comments: 19,
                views: 1323,
                image: '/news3.jpg',
            },
            {
                title: 'Major Advancements in Renewable Energy',
                date: '17 May 2025',
                author: 'Thomas Weller',
                site: 'GreenFuture',
                description: 'The latest innovations in solar and wind tech may soon replace traditional fossil fuels on a large scale.',
                comments: 41,
                views: 2379,
                image: '/news2.jpg',
            },
            {
                title: 'How Countries are Adopting Clean Power',
                date: '16 May 2025',
                author: 'Nina Kumar',
                site: 'EcoNews',
                description: 'Governments worldwide are making strategic moves toward energy independence and clean power.',
                comments: 19,
                views: 1323,
                image: '/news3.jpg',
            },
        ],
    },
    {
        title: 'AI-Powered Education Tools Rise Globally',
        date: '16 May 2025',
        author: 'Grace Nunez',
        site: 'EdTech Times',
        description: 'Artificial intelligence is reshaping the classroom experience, aiding both teachers and students worldwide.',
        comments: 17,
        views: 981,
        image: '/news3.jpg',
    },
];

const Feed: React.FC<FeedProps> = ({selectedView}) => {
    const filteredItems = feedItems.filter(item => {
        if (selectedView === 'Articles') return !('isThread' in item);
        if (selectedView === 'Threads') return 'isThread' in item;
        return true;
    });

    const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '30px', marginLeft: '80px'}}>
            {filteredItems.map((item, index) => {
                if ('isThread' in item && item.isThread) {
                    const visibleArticles = item.articles.slice(0, 3);
                    const remainingCount = item.articles.length - visibleArticles.length;

                    return (
                        <div key={index}
                             style={{display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                                <FaComments size={20} color="#BDBDBD"/>
                                <h2 style={{fontSize: '20px', margin: 0}}>
                                    {item.threadTitle}
                                    <span style={{
                                        fontSize: '14px',
                                        fontWeight: 'normal',
                                        marginLeft: '10px',
                                        color: '#777'
                                    }}>
                                        • Last updated on {item.lastUpdated}
                                    </span>
                                </h2>
                            </div>
                            <div style={{display: 'flex', paddingLeft: '12px'}}>
                                <div style={{width: '2px', backgroundColor: '#BDBDBD', marginRight: '25px'}}/>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '16px',
                                    flex: 1,
                                    marginBottom: '-10px'
                                }}>
                                    {visibleArticles.map((article, idx) => {
                                        const articleId = `thread-${index}-${idx}`;
                                        return (
                                            <div
                                                key={idx}
                                                style={{display: 'flex', gap: '16px', position: 'relative'}}
                                                onMouseEnter={() => setHoveredItemId(articleId)}
                                                onMouseLeave={() => setHoveredItemId(null)}
                                            >
                                                {hoveredItemId === articleId && (
                                                    <div style={{position: 'absolute', top: '-15px', right: '70px'}}>
                                                        <ArticleOptions position="top-right"/>
                                                    </div>
                                                )}
                                                <img
                                                    src={article.image}
                                                    alt={article.title}
                                                    style={{width: '140px', height: '100px', objectFit: 'cover'}}
                                                />
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
                } else {
                    const article = item as Article;
                    const articleId = `article-${index}`;
                    return (
                        <div
                            key={index}
                            style={{display: 'flex', gap: '16px', alignItems: 'flex-start', position: 'relative'}}
                            onMouseEnter={() => setHoveredItemId(articleId)}
                            onMouseLeave={() => setHoveredItemId(null)}
                        >
                            {hoveredItemId === articleId && (
                                <div style={{position: 'absolute', top: '-15px', right: '50px'}}>
                                    <ArticleOptions position="top-right"/>
                                </div>
                            )}
                            <img
                                src={article.image}
                                alt={article.title}
                                style={{width: '140px', height: '100px', objectFit: 'cover'}}
                            />
                            <div>
                                <h3 style={{margin: '0 0 6px', fontSize: '18px', fontWeight: 600}}>{article.title}</h3>
                                <p style={{margin: '0 0 4px', fontSize: '14px', color: '#555'}}>
                                    {article.author} - {article.date} - <span
                                    style={{fontStyle: 'italic'}}>{article.site}</span>
                                </p>
                                <p style={{
                                    fontSize: '15px',
                                    margin: '6px 0 8px',
                                    color: '#333'
                                }}>{article.description}</p>
                                <p style={{fontSize: '13px', color: '#777'}}>
                                    💬 {article.comments} comments &nbsp;&nbsp; 👁️ {article.views} views
                                </p>
                            </div>
                        </div>
                    );
                }
            })}
        </div>
    );
};

export default Feed;
