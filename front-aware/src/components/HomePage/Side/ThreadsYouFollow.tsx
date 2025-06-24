import React, {useEffect, useState} from "react";
import SideThreadsListLayout from "../../Cards/ThreadLayouts/SideThreadsListLayout.tsx";
import type {Thread} from "../../Cards/ThreadLayouts/SideThreadsListLayout.tsx";
import {BASE_URL} from "../../../api/config.ts";

const ThreadsYouFollow: React.FC = () => {
    const [threads, setThreads] = useState<Thread[]>([]);

    useEffect(() => {
        const fetchFollowedThreads = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) return;

            try {
                const res = await fetch(`${BASE_URL}/users/threads-followed`, {
                    headers: {Authorization: `Bearer ${token}`}
                });
                const data = await res.json();

                const mapped: Thread[] = data.map((t: any) => ({
                    id: t._id,
                    name: t.title,
                    date: new Date(t.last_updated).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    }),
                    topic: t.topic?.toLowerCase() || 'general',
                    image: t.image || "/news2.jpg",
                }));

                setThreads(mapped);
            } catch (err) {
                console.error("[ThreadsYouFollow] Failed to fetch followed threads:", err);
            }
        };

        fetchFollowedThreads();
    }, []);

    return (
        <SideThreadsListLayout
            title="Threads You Follow"
            threads={threads}
        />
    );
};

export default ThreadsYouFollow;
