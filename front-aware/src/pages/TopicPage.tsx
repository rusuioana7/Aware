import TopicTag from '../components/Cards/Tags/TopicTag';
import TopTopicArticles from "../components/TopicPage/TopTopicArticles.tsx";
import TopTopicThreads from "../components/TopicPage/TopTopicThreads.tsx";
import TopicFeed from "../components/TopicPage/TopicFeed.tsx";
import {useState} from "react";
import {FaStar} from "react-icons/fa";

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


const TopicPage = () => {
    const topic = 'Lifestyle';
    const [isFavorite, setIsFavorite] = useState(false);

    const onViewChange = (view: 'All' | 'Articles' | 'Threads') => {
        console.log('Selected view:', view);
    };

    const toggleFavorite = () => {
        setIsFavorite(prev => !prev);
    };

    return (
        <div style={{display: 'flex', gap: '24px'}}>
            <div style={{flex: 7}}>
                <div style={{marginBottom: '10px', display: 'inline-flex', alignItems: 'center', gap: '12px'}}>
                    <TopicTag
                        label={topic}
                        style={{
                            fontSize: '18px',
                            padding: '10px 16px',
                        }}
                    />
                    <button
                        onClick={toggleFavorite}
                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            fontSize: '22px',
                            color: isFavorite ? '#FFD700' : '#888',
                            transition: 'color 0.3s ease',
                            padding: 0,
                        }}
                    >
                        <FaStar/>
                    </button>
                </div>
                <div style={{flex: 1, height: 1, backgroundColor: '#CCC', marginBottom: 16}}/>

                <TopicFeed feedItems={feedItems} onViewChange={onViewChange}/>
            </div>

            <div style={{flex: 3}}>
                <TopTopicArticles/>
                <TopTopicThreads/>
            </div>
        </div>
    );
};

export default TopicPage;

