import React from "react";
import SideArticleListLayout from "../Cards/ArticleLayouts/SideArticleListLayout.tsx";
import type {Article} from "../Cards/ArticleLayouts/SideArticleListLayout.tsx";

const TopTopicArticles: React.FC<{ articles: Article[] }> = ({articles}) => {
    return <SideArticleListLayout title="Top Articles" articles={articles}/>;
};

export default TopTopicArticles;
