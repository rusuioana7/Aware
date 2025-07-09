import React, {useEffect, useState} from "react";
import ZoomIfSmall from './ZoomIfSmallPicture';
import TopicTag from '../Cards/Tags/TopicTag.tsx';
import ArticleOptions from '../Cards/ArticleLayouts/ArticleOptions.tsx';
import {useNavigate} from 'react-router-dom';
import {BASE_URL} from "../../api/config.ts";

interface RawArticle {
    _id: string;
    title: string;
    author?: string;
    published: string;
    image?: string;
    topics?: string[];
    source: string;
}

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


const LatestNews: React.FC = () => {
    const largeCardHeight = 392;
    const smallCardHeight = 192;
    const containerWidth = 256;

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [articles, setArticles] = useState<RawArticle[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLatest = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) return;

            try {
                const userRes = await fetch(`${BASE_URL}/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const user = await userRes.json();
                const favoriteTopics = (user.favoriteTopics || []).map((t: string) => t.toLowerCase());
                const languageCodes = (user.language || []).map(languageToCode).join(',');

                const articleSet = new Map<string, RawArticle>();

                // 1 article per topic
                const topicArticles = await Promise.all(
                    favoriteTopics.map(async (topic: string) => {
                        const url = `${BASE_URL}/feed?feed_type=articles&topics=${encodeURIComponent(topic)}&languages=${encodeURIComponent(languageCodes)}&sort=published&page=1&size=1`;
                        const res = await fetch(url);
                        const json = await res.json();
                        return json.articles?.[0] || null;
                    })
                );

                topicArticles
                    .filter((a): a is RawArticle => !!a && !!a._id)
                    .forEach((a) => articleSet.set(a._id, a));

                // Fill the rest if we have < 5
                if (articleSet.size < 5) {
                    const remaining = 5 - articleSet.size;
                    const backupUrl = `${BASE_URL}/feed?feed_type=articles&topics=${encodeURIComponent(favoriteTopics.join(','))}&languages=${encodeURIComponent(languageCodes)}&sort=published&page=1&size=${remaining + 3}`;
                    const backupRes = await fetch(backupUrl);
                    const backupJson = await backupRes.json();

                    (backupJson.articles || []).forEach((a: RawArticle) => {
                        if (a._id && !articleSet.has(a._id)) {
                            articleSet.set(a._id, a);
                        }
                    });
                }

                const sorted = Array.from(articleSet.values()).sort(
                    (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime()
                );

                setArticles(sorted.slice(0, 5));
            } catch (err) {
                console.error("[LatestNews] Failed to load:", err);
            }
        };

        fetchLatest();
    }, []);


    return (
        <div style={{padding: '15px', marginTop: '-20px'}}>
            <p style={{
                fontSize: '22px',
                fontWeight: 'bold',
                color: '#000',
                marginTop: '10px',
                marginBottom: '16px',
                marginLeft: '3px',
            }}>
                Latest News For You
            </p>

            <div style={{display: 'flex'}}>
                <div style={{padding: '4px', width: '50%', height: `${largeCardHeight}px`}}>
                    {articles[0] && (
                        <div
                            style={{
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                                overflow: 'hidden',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                backgroundColor: '#fff',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={() => setHoveredIndex(-1)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onClick={() => navigate(`/article/${articles[0]._id}`)}
                        >
                            <ZoomIfSmall
                                src={articles[0].image || "/placeholder.jpg"}
                                alt={articles[0].title}
                                containerWidth={containerWidth}
                                containerHeight={largeCardHeight}
                            />

                            {hoveredIndex === -1 && (
                                <div
                                    style={{position: 'absolute', top: '10px', right: '10px', zIndex: 2}}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <ArticleOptions articleId={articles[0]._id} position="top-right"/>
                                </div>
                            )}


                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                zIndex: 1,
                                pointerEvents: 'none',
                            }}/>

                            <TopicTag label={articles[0].topics?.[0] || "General"}
                                      style={{position: 'absolute', top: '12px', left: '12px', zIndex: 2}}/>
                            <div style={{position: 'absolute', bottom: '16px', left: '16px', zIndex: 2, color: '#fff'}}>
                                <p style={{fontSize: '24px', fontWeight: 'bold', margin: 0}}>
                                    {articles[0].title}
                                </p>
                                <p style={{
                                    fontSize: '15px',
                                    margin: '4px 0 0 0'
                                }}>{new Date(articles[0].published).toLocaleDateString()} — {articles[0].source}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', width: '50%'}}>
                    {articles.slice(1).map((item, idx) => (
                        <div key={item._id} style={{padding: '4px', height: `${smallCardHeight}px`}}>
                            <div
                                style={{
                                    position: 'relative',
                                    width: '100%',
                                    height: '100%',
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                    backgroundColor: '#fff',
                                    cursor: 'pointer',
                                }}
                                onMouseEnter={() => setHoveredIndex(idx)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                onClick={() => navigate(`/article/${item._id}`)}
                            >
                                <ZoomIfSmall
                                    src={item.image || "/placeholder.jpg"}
                                    alt={item.title}
                                    containerWidth={containerWidth}
                                    containerHeight={smallCardHeight}
                                />

                                {hoveredIndex === idx && (
                                    <div
                                        style={{position: 'absolute', top: '8px', right: '8px', zIndex: 10}}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        <ArticleOptions articleId={item._id} position="top-right"/>
                                    </div>
                                )}


                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                    zIndex: 1,
                                    pointerEvents: 'none',
                                }}/>

                                <TopicTag
                                    label={item.topics?.[0] || "General"}
                                    style={{position: 'absolute', top: '12px', left: '12px', zIndex: 2}}
                                />
                                <div style={{
                                    position: 'absolute',
                                    bottom: '2px',
                                    left: '8px',
                                    zIndex: 2,
                                    color: '#fff'
                                }}>
                                    <p style={{
                                        fontSize: '17px',
                                        fontWeight: 'bold',
                                        margin: 0,
                                        lineHeight: '1.1'
                                    }}>
                                        {item.title}
                                    </p>
                                    <p style={{
                                        fontSize: '12px',
                                        marginTop: '3px'
                                    }}>{new Date(item.published).toLocaleDateString()} — {item.source}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LatestNews;
