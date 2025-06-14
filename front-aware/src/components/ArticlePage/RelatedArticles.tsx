import React, {useEffect, useState} from 'react';
import SideArticleListLayout from '../Cards/ArticleLayouts/SideArticleListLayout';
import type {Article as UIArticle} from '../Cards/ArticleLayouts/SideArticleListLayout';
import type {ThreadData} from '../../pages/ArticlePage';
import {BASE_URL} from '../../api/config';

interface RelatedArticlesProps {
    thread?: ThreadData | null;
    currentId: string;
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({thread, currentId}) => {
    const [articles, setArticles] = useState<UIArticle[]>([]);

    useEffect(() => {
        if (!thread || thread.articles.length < 2) {
            setArticles([]);
            return;
        }

        const otherIds = thread.articles.filter(tid => tid !== currentId);
        if (otherIds.length === 0) {
            setArticles([]);
            return;
        }

        Promise.all(
            otherIds.map(id =>
                fetch(`${BASE_URL}/articles/${id}`)
                    .then(res => {
                        if (!res.ok) throw new Error(`Failed to fetch ${id}`);
                        return res.json();
                    })
                    .then((data: {
                        author?: string;
                        published: string;
                        title: string;
                        topics: string[];
                        image?: string;
                    }) => ({
                        author: data.author || 'Unknown',
                        date: new Date(data.published).toLocaleDateString(),
                        title: data.title,
                        topic: data.topics[0] || 'General',
                        image: data.image || '',
                    } as UIArticle))
            )
        )
            .then(results => setArticles(results))
            .catch(err => {
                console.error('[RelatedArticles] error fetching thread items', err);
                setArticles([]);
            });
    }, [thread, currentId]);

    return (
        <SideArticleListLayout
            title="Related Articles"
            articles={articles}
        />
    );
};

export default RelatedArticles;
