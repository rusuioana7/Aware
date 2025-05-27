import React, {useState} from "react";
import TopicTag from '../components/Cards/Tags/TopicTag';
import SortSelector from "../components/Cards/SelectSort.tsx";
import ViewSelector from "../components/Cards/SelectView.tsx";
import ArticleFeed from '../components/Cards/ArticleFeedLayout.tsx';
import ThreadFeed from '../components/Cards/ThreadFeedLayout.tsx';
import TopTopicArticles from "../components/TopicPage/TopTopicArticles.tsx";
import TopTopicThreads from "../components/TopicPage/TopTopicThreads.tsx";

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
    articles: Article[];
    isThread: true;
};

type FeedItem = Article | Thread;
const feedItems: FeedItem[] = [
    {
        title: 'Breakthrough in Quantum Computing',
        date: '18 May 2025',
        topic: 'lifestyle',
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
                topic: 'lifestyle',
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
                topic: 'lifestyle',
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
        topic: 'lifestyle',
        author: 'Grace Nunez',
        site: 'EdTech Times',
        description:
            'Artificial intelligence is reshaping the classroom experience, aiding both teachers and students worldwide.',
        comments: 17,
        views: 981,
        image: '/news3.jpg',
    },
];

type OptionsProps = {
    onViewChange: (view: 'All' | 'Articles' | 'Threads') => void;
};

const sortOptions: Array<'Newest' | 'Popular' | 'Verified Only'> = ['Newest', 'Popular', 'Verified Only'];
const viewOptions: Array<'All' | 'Articles' | 'Threads'> = ['All', 'Articles', 'Threads'];

const TopicPage: React.FC<OptionsProps> = ({onViewChange}) => {
    const topic = 'Lifestyle';
    const [selectedSort, setSelectedSort] = useState<'Newest' | 'Popular' | 'Verified Only'>('Newest');

    const [selectedView, setSelectedView] = useState<'All' | 'Articles' | 'Threads'>('All');

    const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

    const filteredItems = feedItems.filter(item => {
        if (selectedView === 'Articles') return !('isThread' in item);
        if (selectedView === 'Threads') return 'isThread' in item;
        return true;
    });

    const handleViewChange = (option: 'All' | 'Articles' | 'Threads') => {
        const newView = selectedView === option ? 'All' : option;
        setSelectedView(newView);
        onViewChange(newView);
    };

    return (
        <div style={{display: 'flex', gap: '24px'}}>
            <div style={{flex: 7}}>
                <div style={{
                    marginBottom: '10px',
                    display: 'inline-block'
                }}>
                    <TopicTag
                        label={topic}
                        style={{
                            fontSize: '18px',
                            padding: '10px 16px',
                        }}
                    />
                </div>
                <div style={{flex: 1, height: 1, backgroundColor: '#CCC', marginBottom: 16}}/>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 60,
                        flexWrap: 'wrap',
                        marginBottom: 10,
                    }}
                >
                    <SortSelector options={sortOptions} selected={selectedSort} onSelect={setSelectedSort}/>
                    <ViewSelector options={viewOptions} selected={selectedView} onSelect={handleViewChange}/>
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    marginTop: '30px',
                    marginLeft: '30px'
                }}>
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
                            const article = item as Article;
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


            </div>

            <div style={{flex: 3}}>
                <TopTopicArticles/>
                <TopTopicThreads/>
            </div>
        </div>
    );
};

export default TopicPage;
