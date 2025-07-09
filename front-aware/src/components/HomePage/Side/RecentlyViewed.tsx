import React, {useEffect, useState} from "react";
import SideArticleListLayout from "../../Cards/ArticleLayouts/SideArticleListLayout.tsx";
import type {Article} from "../../Cards/ArticleLayouts/SideArticleListLayout.tsx";
import {useNavigate} from "react-router-dom";
import {BASE_URL} from "../../../api/config.ts";

interface RawArticle {
    _id: string;
    title: string;
    author?: string;
    published: string;
    topics?: string[];
    image?: string;
}

const RecentlyViewed: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecent = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) return;

            try {
                const res = await fetch(`${BASE_URL}/users/recent-articles`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data: RawArticle[] = await res.json();

                const normalized: Article[] = data
                    .map((a) => ({
                        id: a._id,
                        title: a.title,
                        author: a.author || "Unknown",
                        topic: (a.topics?.[0] || "General").toLowerCase(),
                        date: new Date(a.published).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        }),
                        image: a.image || "/placeholder.jpg",
                        onClick: () => navigate(`/articles/${a._id}`),
                    }))
                    .filter((a) => !!a.id);

                setArticles(normalized);
            } catch (err) {
                console.error("[RecentlyViewed] Failed to fetch:", err);
            }
        };

        fetchRecent();
    }, [navigate]);

    return articles.length === 0 ? null : (
        <SideArticleListLayout title="Recently Viewed" articles={articles} />
    );

};

export default RecentlyViewed;
