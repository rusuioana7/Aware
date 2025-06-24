import React, {useEffect, useState} from "react";
import SideArticleListLayout from "../../Cards/ArticleLayouts/SideArticleListLayout.tsx";
import type {Article} from "../../Cards/ArticleLayouts/SideArticleListLayout.tsx";
import {BASE_URL} from "../../../api/config";

const languageToCode = (lang: string): string => {
    const map: Record<string, string> = {
        english: 'en',
        romanian: 'ro',
        french: 'fr',
        german: 'de',
        spanish: 'es',
    };
    return map[lang.toLowerCase()] || lang.toLowerCase();
};

const Trending: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
        const fetchTrending = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                console.warn("[Trending] No auth token");
                return;
            }

            try {
                const userRes = await fetch(`${BASE_URL}/users/me`, {
                    headers: {Authorization: `Bearer ${token}`}
                });
                const user = await userRes.json();

                const favoriteTopics: string[] = (user.favoriteTopics || []).map((t: string) => t.toLowerCase());
                const languageCodes: string[] = (user.language || []).map(languageToCode);
                const langParam = languageCodes.join(',');
                const langQuery = languageCodes.length > 0
                    ? `&languages=${encodeURIComponent(langParam)}`
                    : '';

                console.log("[Trending] Favorite topics:", favoriteTopics);
                console.log("[Trending] Language codes:", languageCodes);

                const topicRequests = favoriteTopics.map(async topic => {
                    const url = `${BASE_URL}/feed?feed_type=articles&topics=${encodeURIComponent(topic)}${langQuery}&sort=views&page=1&size=1`;
                    console.log(`[Trending] Fetching for topic "${topic}": ${url}`);

                    const res = await fetch(url);
                    const data = await res.json();
                    const top = data.articles?.[0];

                    return top
                        ? {
                            id: top._id,
                            author: top.author || "Unknown",
                            topic: (top.topics?.[0] || "General").toLowerCase(),
                            date: new Date(top.published).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            }),
                            title: top.title,
                            image: top.image || "/placeholder.jpg",
                        }
                        : null;
                });

                const results = await Promise.all(topicRequests);
                const valid = results.filter((a): a is Article => !!a && !!a.id);
                setArticles(valid);
                console.log("[Trending] Final articles:", valid);
            } catch (err) {
                console.error("[Trending] Failed to fetch trending articles:", err);
            }
        };

        fetchTrending();
    }, []);

    return <SideArticleListLayout title="Trending For You" articles={articles}/>;
};

export default Trending;
