import React, {useState} from 'react';
import SortSelector from '../Cards/SelectMenu/SelectSort.tsx';
import ViewSelector from '../Cards/SelectMenu/SelectView.tsx';
import ArticleFeed from '../Cards/ArticleLayouts/ArticleFeedLayout.tsx';
import ThreadFeed from '../Cards/ThreadLayouts/ThreadFeedLayout.tsx';

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

type Props = {
    feedItems: FeedItem[];
    onViewChange: (view: 'All' | 'Articles' | 'Threads') => void;
};

const sortOptions: Array<'Newest' | 'Popular' | 'Verified Only'> = ['Newest', 'Popular', 'Verified Only'];
const viewOptions: Array<'All' | 'Articles' | 'Threads'> = ['All', 'Articles', 'Threads'];

const TopicFeed: React.FC<Props> = ({feedItems, onViewChange}) => {
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
        <>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 60,
                flexWrap: 'wrap',
                marginBottom: 10,
            }}>
                <SortSelector options={sortOptions} selected={selectedSort} onSelect={setSelectedSort}/>
                <ViewSelector options={viewOptions} selected={selectedView} onSelect={handleViewChange}/>
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                marginTop: '30px',
                marginLeft: '30px',
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
        </>
    );
};

export default TopicFeed;
