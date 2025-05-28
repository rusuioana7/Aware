import React from "react";
import SideArticleListLayout from "../../Cards/ArticleLayouts/SideArticleListLayout.tsx";
import type {Article} from "../../Cards/ArticleLayouts/SideArticleListLayout.tsx";

const trendingArticles: Article[] = [
    {
        author: 'Craig Bator',
        date: '27 Dec 2020',
        title: 'Gluten-Free Almond Cake with Berries',
        topic: 'Food',
        image: '/news3.jpg',
    },
    {
        author: 'Jane Doe',
        date: '15 Jan 2021',
        title: '10-Minute Healthy Breakfast Ideas',
        topic: 'Food',
        image: '/news3.jpg',
    },
    {
        author: 'Mark Smith',
        date: '01 Mar 2021',
        title: 'Benefits of Intermittent Fasting',
        topic: 'Food',
        image: '/news3.jpg',
    },
    {
        author: 'Sally Green',
        date: '10 Feb 2021',
        title: '5 Salad Recipes for Every Season',
        topic: 'Food',
        image: '/news3.jpg',
    },
    {
        author: 'Leo King',
        date: '05 Apr 2021',
        title: 'Homemade Vegan Burgers in 20 Minutes',
        topic: 'Food',
        image: '/news3.jpg',
    },
];

const Trending: React.FC = () => {
    return <SideArticleListLayout title="Trending For You" articles={trendingArticles}/>;
};

export default Trending;
