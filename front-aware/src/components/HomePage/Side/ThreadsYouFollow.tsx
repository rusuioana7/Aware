import SideThreadsListLayout from "../../Cards/ThreadLayouts/SideThreadsListLayout.tsx";
import type {Thread} from "../../Cards/ThreadLayouts/SideThreadsListLayout.tsx";

const followedThreads: Thread[] = [
    {
        name: 'AI Regulation Updates',
        date: '17 May 2025',
        topic: 'Tech',
        image: '/news2.jpg',
    },
    {
        name: 'Olympic Games 2024 Recap',
        date: '12 May 2025',
        topic: 'Sport',
        image: '/news2.jpg',
    },
    {
        name: 'Climate Policy Debates',
        date: '10 May 2025',
        topic: 'Politics',
        image: '/news2.jpg',
    },
    {
        name: 'Economic Forecasts 2025',
        date: '06 May 2025',
        topic: 'Economy',
        image: '/news2.jpg',
    },
];

const ThreadsYouFollow = () => (
    <SideThreadsListLayout title="Threads You Follow" threads={followedThreads}/>
);

export default ThreadsYouFollow;
