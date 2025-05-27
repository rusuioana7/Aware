import React from 'react';
import TopicTag from '../components/Cards/Tags/TopicTag';
import {FaComments} from "react-icons/fa";
import Article from '../components/ArticlePage/ArticleLayout';

const ArticlePage: React.FC = () => {
    const article = {
        topic: 'Lifestyle',
        thread: 'Fitness',
        title: 'How to Stay Healthy While Working Remotely',
        image: '../news1.jpg',
        content: `
Remote work has many perks, but staying healthy can be a challenge...

Here are 5 tips to maintain your well-being while working from home:

1. Set a routine. 
2. Take active breaks.
3. Ergonomic workspace.
4. Mindful eating.
5. Social connection.

Following these strategies can help remote workers feel more balanced, connected, and energized throughout the day.
        `,
        author: 'Mirela Mirelascu',
        publisher: 'Healthy Living Media',
        publishedAt: 'May 25, 2025',
        publishedTime: '14:30',
        readingTime: '3 min read'
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
                <TopicTag label={article.topic}/>
                <span>&gt;</span>
                <FaComments size={16}/>
                <span>{article.thread}</span>
                <span>&gt;</span>
                <span style={{fontWeight: 'bold'}}>{article.title}</span>
            </div>

            <div style={{display: 'flex', gap: '20px'}}>
                <div style={{flex: 7}}>
                    <Article
                        title={article.title}
                        image={article.image}
                        content={article.content}
                        author={article.author}
                        publisher={article.publisher}
                        publishedAt={article.publishedAt}
                        publishedTime={article.publishedTime}
                        readingTime={article.readingTime} category={''}/>
                </div>

                <div style={{flex: 3}}>
                </div>
            </div>
        </div>
    );
};

export default ArticlePage;
