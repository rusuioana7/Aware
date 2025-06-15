import React, {useEffect, useState} from 'react';
import SideArticleListLayout, {
    type Article as UIArticle,
} from '../Cards/ArticleLayouts/SideArticleListLayout';
import type {ThreadData} from '../../pages/ArticlePage';
import {BASE_URL} from '../../api/config';

interface RelatedArticlesProps {
    thread?: ThreadData | null;
    currentId: string;
}

const MAX_RELATED = 5;

const RelatedArticles: React.FC<RelatedArticlesProps> = ({thread, currentId}) => {
    const [articles, setArticles] = useState<UIArticle[]>([]);

    useEffect(() => {
        if (!thread || thread.articles.length < 2) {
            setArticles([]);
            return;
        }

        const otherIds = thread.articles.filter((aid) => aid !== currentId).slice(0, MAX_RELATED);
        if (otherIds.length === 0) {
            setArticles([]);
            return;
        }

        Promise.all(
            otherIds.map((aid) =>
                fetch(`${BASE_URL}/articles/${aid}`)
                    .then((res) => {
                        if (!res.ok) throw new Error(`Failed to fetch article ${aid}`);
                        return res.json();
                    })
                    .then((data: any) =>
                        ({
                            id: data._id,
                            author: data.author || 'Unknown',
                            date: new Date(data.published).toLocaleDateString(),
                            title: data.title,
                            topic: data.topics[0] || 'General',
                            image: data.image || '',
                        } as UIArticle)
                    )
            )
        )
            .then((results) => setArticles(results))
            .catch((err) => {
                console.error('[RelatedArticles] error fetching related articles', err);
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
