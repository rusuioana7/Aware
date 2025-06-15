import React from "react";
import {Link} from "react-router-dom";
import TopicTag from "../Tags/TopicTag";

export interface Thread {
    id: string;
    name: string;
    date: string;
    topic: string;
    image: string;
}

interface SideThreadsListLayoutProps {
    title: string;
    threads: Thread[];
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
    nameText: {
        fontSize: "18px",
        fontWeight: 550,
        margin: "30px 0 2px",
        color: "#222",
    },
    lastUpdated: {
        fontSize: "15px",
        color: "#000000",
        margin: 0,
    },
};

const SideThreadsListLayout: React.FC<SideThreadsListLayoutProps> = ({title, threads}) => {
    return (
        <div style={styles.section}>
            <h2 style={styles.title}>{title}</h2>
            <div style={styles.divider}/>
            <div style={styles.list}>
                {threads.length === 0 ? (
                    <div style={{fontStyle: "italic", color: "#666", padding: "8px 0"}}>
                        Not included in any thread.
                    </div>
                ) : (
                    threads.map((thread) => (
                        <Link
                            key={thread.id}
                            to={`/thread/${thread.id}`}
                            style={{
                                textDecoration: "none",
                                color: "inherit",
                                display: "block"
                            }}
                        >
                            <div style={styles.item}>
                                <div style={styles.tag}>
                                    <TopicTag label={thread.topic}/>
                                </div>
                                <img
                                    src={thread.image}
                                    alt={thread.name}
                                    style={styles.image}
                                />
                                <div style={{flex: 1, minWidth: 0}}>
                                    <p style={styles.nameText}>{thread.name}</p>
                                    <p style={styles.lastUpdated}>
                                        Last updated on {thread.date}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default SideThreadsListLayout;
