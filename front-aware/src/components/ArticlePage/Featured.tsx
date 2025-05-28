import SideThreadsListLayout from "../Cards/ThreadLayouts/SideThreadsListLayout.tsx";
import type {Thread} from "../Cards/ThreadLayouts/SideThreadsListLayout.tsx";

const featuredThreads: Thread[] = [
    {
        name: 'Global AI Ethics',
        date: '18 May 2025',
        topic: 'Tech',
        image: '/news2.jpg',
    },
    {
        name: 'UEFA Finals Commentary',
        date: '17 May 2025',
        topic: 'Sport',
        image: '/news2.jpg',
    },
    {
        name: 'Presidential Debate Highlights',
        date: '16 May 2025',
        topic: 'Politics',
        image: '/news2.jpg',
    },
    {
        name: 'Q2 Market Trends',
        date: '15 May 2025',
        topic: 'Economy',
        image: '/news2.jpg',
    },
];

const Featured = () => (
    <SideThreadsListLayout title="Featured In" threads={featuredThreads}/>
);

export default Featured;
