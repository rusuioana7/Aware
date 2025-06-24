import React from "react";
import SideThreadsListLayout from "../Cards/ThreadLayouts/SideThreadsListLayout.tsx";
import type {Thread} from "../Cards/ThreadLayouts/SideThreadsListLayout.tsx";

const TopTopicThreads: React.FC<{ threads: Thread[] }> = ({threads}) => {
    return <SideThreadsListLayout title="Top Threads" threads={threads}/>;
};

export default TopTopicThreads;
