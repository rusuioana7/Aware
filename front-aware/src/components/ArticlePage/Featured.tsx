import React from 'react';
import SideThreadsListLayout, {
    type Thread as UIThread,
} from '../Cards/ThreadLayouts/SideThreadsListLayout';
import type {ThreadData} from '../../pages/ArticlePage';

interface FeaturedProps {
    thread?: ThreadData | null;
}

const Featured: React.FC<FeaturedProps> = ({thread}) => {
    console.log('[Featured] got thread prop →', thread);

    let threadsToShow: UIThread[] = [];

    if (thread && thread.articles.length > 1) {
        threadsToShow = [
            {
                name: thread.title,
                date: new Date(thread.last_updated).toLocaleDateString(),
                topic: thread.topic || 'General',
                image: thread.image || '',
            },
        ];
    }

    return (
        <SideThreadsListLayout
            title="Featured In"
            threads={threadsToShow}
        />
    );
};

export default Featured;
