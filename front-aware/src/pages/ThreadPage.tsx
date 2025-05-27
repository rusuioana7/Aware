import React from 'react';
import {FaComments} from 'react-icons/fa';
import TopicTag from '../components/Cards/Tags/TopicTag';
import RelatedThreads from '../components/ThreadPage/RelatedThreads';
import TopArticles from '../components/ThreadPage/TopArticles';
import ThreadLayout from '../components/ThreadPage/ThreadLayout';
import type {ArticleFeedLayout} from '../components/Cards/ArticleFeedLayout';

const ThreadPage: React.FC = () => {
    const thread = {
        topic: 'Lifestyle',
        thread: 'Fitness',
        lastUpdated: 'May 25, 2025',
        articles: [
            {
                topic: 'Lifestyle',
                title: 'How to Stay Healthy While Working Remotely',
                image: '../news1.jpg',
                author: 'Mirela Mirelascu',
                date: 'May 24, 2025',
                site: 'Healthy Living',
                description: 'Tips for staying active and healthy while working from home.',
                comments: 12,
                views: '1.2K',
            },
            {
                topic: 'Wellness',
                title: 'Morning Routines of Productive People',
                image: '../news2.jpg',
                author: 'John Fitzen',
                date: 'May 22, 2025',
                site: 'Mind Matters',
                description: 'Discover how top performers start their days with purpose.',
                comments: 8,
                views: '980',
            },
        ] as unknown as ArticleFeedLayout[],
    };

    return (
        <div style={{position: 'relative'}}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '16px',
                gap: '8px',
                fontSize: '14px',
                color: '#031A6B',
                fontWeight: 500
            }}>
                <TopicTag label={thread.topic}/>
                <span>&gt;</span>
                <FaComments size={18}/>
                <span>{thread.thread}</span>
            </div>

            <div style={{display: 'flex', gap: '24px'}}>
                <ThreadLayout
                    threadTitle={thread.thread}
                    lastUpdated={thread.lastUpdated}
                    articles={thread.articles}
                />

                <div style={{flex: 3}}>
                    <RelatedThreads/>
                    <TopArticles/>
                </div>
            </div>
        </div>
    );
};

export default ThreadPage;
