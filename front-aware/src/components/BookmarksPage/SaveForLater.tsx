import React, {useMemo, useState} from 'react';
import ArticleFeed, {type ArticleFeedLayout} from '../Cards/ArticleLayouts/ArticleFeedLayout.tsx';
import SelectSort from '../Cards/SelectMenu/SelectSort.tsx';
import SelectView from '../Cards/SelectMenu/SelectView.tsx';
import SelectLength from '../Cards/SelectMenu/SelectLength.tsx';

const exampleArticles: Record<string, ArticleFeedLayout[]> = {
    saveForLater: [
        {
            title: 'React Hooks Deep Dive',
            date: '2025-05-01',
            topic: 'React',
            author: 'Jane Doe',
            site: 'reactblog.com',
            description: 'Learn the ins and outs of React Hooks with practical examples.',
            comments: 12,
            views: 1500,
            image: '../news1.jpg',
        },
        {
            title: 'Understanding TypeScript Generics',
            date: '2025-04-15',
            topic: 'TypeScript',
            author: 'John Smith',
            site: 'typescriptweekly.com',
            description: 'A beginner-friendly guide to generics in TypeScript.',
            comments: 8,
            views: 900,
            image: '../news1.jpg',
        },
        {
            title: 'CSS Grid vs Flexbox',
            date: '2025-03-20',
            topic: 'CSS',
            author: 'Alice Blue',
            site: 'cssdaily.com',
            description: 'When and how to use CSS Grid and Flexbox effectively.',
            comments: 15,
            views: 1100,
            image: '../news1.jpg',
        },
        {
            title: 'Brainstorming Techniques',
            date: '2025-02-28',
            topic: 'Productivity',
            author: 'Mark Green',
            site: 'productivityhub.io',
            description: 'Boost creativity with these proven brainstorming methods.',
            comments: 5,
            views: 700,
            image: '../news1.jpg',
        },
        {
            title: 'My Travel Blog',
            date: '2025-01-10',
            topic: 'Travel',
            author: 'Chris Wander',
            site: 'wanderlust.com',
            description: 'Experiences and tips from my latest trips around the world.',
            comments: 20,
            views: 1800,
            image: '../news1.jpg',
        },
    ],
    default: [],
};

type SortOption = 'Newest' | 'Popular' | 'Verified Only';
type ViewOption = 'All' | 'Articles' | 'Threads';

const SaveForLater: React.FC = () => {
    const folderId = 'saveForLater';
    const articles = exampleArticles[folderId] || exampleArticles.default;

    const [selectedSort, setSelectedSort] = useState<SortOption>('Newest');
    const [selectedView, setSelectedView] = useState<ViewOption>('All');
    const [length, setLength] = useState<'All' | 'Short' | 'Medium' | 'Long'>('All');

    const sortedArticles = useMemo(() => {
        let filtered = articles;

        if (selectedView === 'Threads') {
            filtered = [];
        }

        return [...filtered].sort((a, b) => {
            if (selectedSort === 'Newest') {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            } else if (selectedSort === 'Popular') {
                return b.views - a.views;
            } else if (selectedSort === 'Verified Only') {
                return 0;
            }
            return 0;
        });
    }, [articles, selectedSort, selectedView]);

    return (
        <div style={{marginLeft: '20px'}}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 40,
                    marginBottom: 25,
                }}
            >
                <SelectSort
                    options={['Newest', 'Popular', 'Verified Only']}
                    selected={selectedSort}
                    onSelect={setSelectedSort}
                />
                <SelectView
                    options={['All', 'Articles', 'Threads']}
                    selected={selectedView}
                    onSelect={setSelectedView}
                />
                <SelectLength
                    options={['All', 'Short', 'Medium', 'Long']}
                    selected={length}
                    onSelect={setLength}
                />
            </div>

            {sortedArticles.length === 0 ? (
                <p>No articles in this folder.</p>
            ) : (
                sortedArticles.map((article, index) => (
                    <ArticleFeed
                        key={index}
                        id={`${folderId}-article-${index}`}
                        article={article}
                        isHovered={false}
                        onHover={() => {
                        }}
                    />
                ))
            )}
        </div>
    );
};

export default SaveForLater;
