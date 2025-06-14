import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import TopicTag from '../components/Cards/Tags/TopicTag';
import {FaComments} from 'react-icons/fa';
import Article from '../components/ArticlePage/ArticleLayout';
import Featured from '../components/ArticlePage/Featured';
import RelatedArticles from '../components/ArticlePage/RelatedArticles';
import {BASE_URL} from '../api/config';
import CommentSection from "../components/ArticlePage/CommentSection.tsx";

export interface ThreadData {
    image?: string;
    topic?: string;
    id: string;
    title: string;
    articles: string[];
    last_updated: string;
}

interface ArticleData {
    _id: string;
    url: string;
    source: string;
    title: string;
    description?: string;
    published: string;
    author?: string;
    content: string;
    image?: string;
    topics: string[];
    thread?: ThreadData | null;
}

const ArticlePage: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [article, setArticle] = useState<ArticleData | null>(null);

    useEffect(() => {
        if (!id) return;
        const fetchUrl = `${BASE_URL}/articles/${id}`;
        console.log('[ArticlePage] fetching:', fetchUrl);

        (async () => {
            try {
                const res = await fetch(fetchUrl);
                console.log('[ArticlePage] response status:', res.status);
                const data: ArticleData = await res.json();
                console.log('[ArticlePage] got article.thread:', data.thread);
                setArticle(data);
            } catch (err) {
                console.error('[ArticlePage] fetch error:', err);
            }
        })();
    }, [id]);

    if (!article) return <div>Loading…</div>;

    const wordCount = article.content.split(/\s+/).length;
    const readingTime = `${Math.ceil(wordCount / 200)} min read`;
    const mainTopic = article.topics[0] || 'General';

    const crumbs: React.ReactNode[] = [
        <TopicTag key="topic" label={mainTopic}/>,
    ];
    if (article.thread && article.thread.articles.length > 1) {
        crumbs.push(<span key="sep1">&nbsp;&gt;&nbsp;</span>);
        crumbs.push(<FaComments key="icon" size={14}/>);
        crumbs.push(
            <span key="thread" style={{margin: '0 4px'}}>
        {article.thread.title}
      </span>
        );
    }
    crumbs.push(<span key="sep2">&nbsp;&gt;&nbsp;</span>);
    crumbs.push(<strong key="title">{article.title}</strong>);

    return (
        <div style={{padding: 8}}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 16,
                gap: 4,
                fontSize: 14,
                color: '#031A6B',
                fontWeight: 500,
            }}>
                {crumbs}
            </div>
            <div style={{display: 'flex', gap: 20}}>
                <div style={{flex: 7}}>
                    <Article
                        title={article.title}
                        category={mainTopic}
                        image={article.image}
                        content={article.content}
                        author={article.author || 'Unknown'}
                        publisher={article.source}
                        publishedAt={new Date(article.published).toLocaleDateString()}
                        readingTime={readingTime}
                        originalUrl={article.url}
                    />
                    <CommentSection/>
                </div>
                <div style={{flex: 3}}>
                    <Featured thread={article.thread || undefined}/>
                    <RelatedArticles
                        thread={article.thread}
                        currentId={article._id}
                    />
                </div>
            </div>
        </div>
    );
};

export default ArticlePage;
