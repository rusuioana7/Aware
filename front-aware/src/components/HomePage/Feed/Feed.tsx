import React, {useState} from 'react';

import ArticleFeed from '../../Cards/ArticleFeedLayout.tsx';
import ThreadFeed from '../../Cards/ThreadFeedLayout.tsx';

type Article = {
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

type Thread = {
    threadTitle: string;
    lastUpdated: string;
    articles: ArticleFeed[];
    isThread: true;
};

type FeedItem = ArticleFeed | ThreadFeed;

type ViewProps = {
    selectedView: 'All' | 'Articles' | 'Threads';
};

const feedItems: FeedItem[] = [
    {
        title: 'Breakthrough in Quantum Computing',
        date: '18 May 2025',
        topic: 'travel',
        author: 'Elena Maxwell',
        site: 'ScienceDaily',
        description:
            'Researchers have made a significant leap in quantum processing power, opening new doors for tech innovation.',
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
                topic: 'travel',
                author: 'Thomas Weller',
                site: 'GreenFuture',
                description:
                    'The latest innovations in solar and wind tech may soon replace traditional fossil fuels on a large scale.',
                comments: 41,
                views: 2379,
                image: '/news2.jpg',
            },
            {
                title: 'How Countries are Adopting Clean Power',
                date: '16 May 2025',
                topic: 'travel',
                author: 'Nina Kumar',
                site: 'EcoNews',
                description:
                    'Governments worldwide are making strategic moves toward energy independence and clean power.',
                comments: 19,
                views: 1323,
                image: '/news3.jpg',
            },
        ],
    },
    {
        title: 'AI-Powered Education Tools Rise Globally',
        date: '16 May 2025',
        topic: 'travel',
        author: 'Grace Nunez',
        site: 'EdTech Times',
        description:
            'Artificial intelligence is reshaping the classroom experience, aiding both teachers and students worldwide.',
        comments: 17,
        views: 981,
        image: '/news3.jpg',
    },
];

const Feed: React.FC<ViewProps> = ({selectedView}) => {
    const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

    const filteredItems = feedItems.filter(item => {
        if (selectedView === 'Articles') return !('isThread' in item);
        if (selectedView === 'Threads') return 'isThread' in item;
        return true;
    });

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '30px', marginLeft: '80px'}}>
            {filteredItems.map((item, index) => {
                if ('isThread' in item && item.isThread) {
                    return (
                        <ThreadFeed
                            key={index}
                            thread={item}
                            threadIndex={index}
                            hoveredItemId={hoveredItemId}
                            setHoveredItemId={setHoveredItemId}
                        />
                    );
                } else {
                    const article = item as ArticleFeed;
                    const articleId = `article-${index}`;
                    return (
                        <ArticleFeed
                            key={index}
                            article={article}
                            id={articleId}
                            isHovered={hoveredItemId === articleId}
                            onHover={setHoveredItemId}
                        />
                    );
                }
            })}
        </div>
    );
};

export default Feed;
