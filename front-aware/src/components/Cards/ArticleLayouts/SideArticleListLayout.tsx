import React, {useState} from "react";
import {Link} from "react-router-dom";
import TopicTag from "../Tags/TopicTag";
import ArticleOptions from "./ArticleOptions";

export interface Article {
    id: string;
    author: string;
    date: string;
    title: string;
    topic: string;
    image: string;
}

interface SideArticleListProps {
    title: string;
    articles: Article[];
}

const styles: Record<string, React.CSSProperties> = {
    section: {
        marginBottom: "30px",
    },
    title: {
        fontSize: "22px",
        fontWeight: "bold",
        marginBottom: "7px",
        color: "#000000",
    },
    divider: {
        height: "1px",
        backgroundColor: "#CCCCCC",
        marginBottom: "12px",
    },
    list: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    item: {
        display: "flex",
        gap: "10px",
        alignItems: "flex-start",
        position: "relative",
    },
    image: {
        width: "70px",
        height: "70px",
        objectFit: "cover",
        display: "block",
    },
    tag: {
        position: "absolute",
        top: 0,
        left: "80px",
    },
    options: {
        padding: "5px",
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 10,
    },
    authorDate: {
        fontSize: "15px",
        color: "#000000",
        margin: "30px 0 2px",
    },
    titleText: {
        fontSize: "15px",
        fontWeight: 550,
        margin: 0,
        color: "#222",
    },
};

const SideArticleListLayout: React.FC<SideArticleListProps> = ({title, articles}) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div style={styles.section}>
            <h2 style={styles.title}>{title}</h2>
            <div style={styles.divider}/>

            <div style={styles.list}>
                {articles.map((article, index) => (
                    <Link
                        key={article.id}
                        to={`/article/${article.id}`}
                        style={{
                            textDecoration: "none",
                            color: "inherit",
                            display: "block",
                        }}
                    >
                        <div
                            style={styles.item}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <div style={{position: "relative"}}>
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    style={styles.image}
                                />

                                {hoveredIndex === index && (
                                    <div
                                        style={styles.options}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                        }}
                                    >
                                        <ArticleOptions articleId={article.id} position="top-right"/>
                                    </div>
                                )}


                                <div style={styles.tag}>
                                    <TopicTag label={article.topic}/>
                                </div>
                            </div>

                            <div style={{flex: 1, minWidth: 0}}>
                                <p style={styles.authorDate}>
                                    {article.author} - {article.date}
                                </p>
                                <p style={styles.titleText}>{article.title}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SideArticleListLayout;
