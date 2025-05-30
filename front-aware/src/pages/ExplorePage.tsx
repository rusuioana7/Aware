import React, {useState} from 'react';
import SearchBar from '../components/ExplorePage/SearchBar';
import FilterPop from "../components/ExplorePage/Filter/FilterPop.tsx";
import {Filter} from 'lucide-react';
import Trending from "../components/ExplorePage/Trending.tsx";
import Discover from "../components/ExplorePage/Discover.tsx";
import type {Article} from "../components/ExplorePage/Trending.tsx";


const sampleArticles: Article[] = [
    {
        id: '1',
        title: 'AI Breakthrough Promises to Revolutionize Medicine',
        date: 'May 21, 2025',
        topic: 'travel',
        author: 'Dr. Elena Gomez',
        site: 'HealthTech Daily',
        description: 'A new AI model outperforms doctors in diagnosing rare diseases...',
        comments: 42,
        views: 10500,
        image: '/news2.jpg',
        credibilityStatus: 'verified',
    },
    {
        id: '2',
        title: 'Electric Cars Surpass Gas Vehicles in Europe',
        date: 'May 19, 2025',
        topic: 'travel',
        author: 'Marcus Leung',
        site: 'Eco Mobility News',
        description: 'EVs now account for over 55% of new vehicle sales in Europe...',
        comments: 28,
        views: 8900,
        image: '/news2.jpg',
        credibilityStatus: 'suspicious',
    },
    {
        id: '3',
        title: 'NASA Unveils New Moon Mission Timeline',
        date: 'May 18, 2025',
        topic: 'travel',
        author: 'Ava Singh',
        site: 'Science Frontier',
        description: 'The Artemis program plans to land the next astronauts by 2027...',
        comments: 17,
        views: 7200,
        image: '/news2.jpg',
        credibilityStatus: 'under-review',
    },
    {
        id: '4',
        title: 'NASA Unveils New Moon Mission Timeline',
        date: 'May 18, 2025',
        topic: 'travel',
        author: 'Ava Singh',
        site: 'Science Frontier',
        description: 'The Artemis program plans to land the next astronauts by 2027...',
        comments: 17,
        views: 7200,
        image: '/news2.jpg',
        credibilityStatus: 'unknown',
    },
    {
        id: '5',
        title: 'NASA Unveils New Moon Mission Timeline',
        date: 'May 18, 2025',
        topic: 'travel',
        author: 'Ava Singh',
        site: 'Science Frontier',
        description: 'The Artemis program plans to land the next astronauts by 2027...',
        comments: 17,
        views: 7200,
        image: '/news2.jpg',
        credibilityStatus: 'untrustworthy',
    },
    {
        id: '5',
        title: 'NASA Unveils New Moon Mission Timeline',
        date: 'May 18, 2025',
        topic: 'travel',
        author: 'Ava Singh',
        site: 'Science Frontier',
        description: 'The Artemis program plans to land the next astronauts by 2027...',
        comments: 17,
        views: 7200,
        image: '/news2.jpg',
        credibilityStatus: 'verified',
    },
    {
        id: '5',
        title: 'NASA Unveils New Moon Mission Timeline',
        date: 'May 18, 2025',
        topic: 'travel',
        author: 'Ava Singh',
        site: 'Science Frontier',
        description: 'The Artemis program plans to land the next astronauts by 2027...',
        comments: 17,
        views: 7200,
        image: '/news2.jpg',
        credibilityStatus: 'verified',
    },
];

const ExplorePage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const toggleFilters = () => {
        setShowFilters(prev => !prev);
    };

    return (
        <div style={{position: 'relative', padding: '15px'}}>
            {/* search  */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '10px'
            }}>
                <SearchBar
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search articles, threads..."
                />
                <button
                    onClick={toggleFilters}
                    style={{
                        padding: '8px',
                        border: '1px solid #031A6B',
                        backgroundColor: '#031A6B',
                        color: 'white',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                    }}
                    title="Open Filters"
                >
                    <Filter size={20}/>
                </button>
            </div>
            <div style={{
                display: 'flex',
                gap: '40px',
                marginBottom: '10px',
                borderBottom: '2px solid #ddd',

            }}>
                <h2 style={{fontSize: '25px', marginBottom: '10px'}}>Trending </h2>


            </div>
            <Trending articles={sampleArticles}/>

            <div style={{
                display: 'flex',
                gap: '40px',
                marginBottom: '10px',
                borderBottom: '2px solid #ddd',

            }}>
                <h2 style={{fontSize: '25px', marginBottom: '10px'}}>Discover </h2>


            </div>
            <Discover/>


            {/* filter */}
            {showFilters && (
                <>
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            zIndex: 99,
                        }}
                        onClick={toggleFilters}
                    />

                    <div
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 100,
                            backgroundColor: 'white',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                            borderRadius: 16,
                            padding: 30,
                            width: '100%',
                            maxWidth: '700px',
                            maxHeight: '700px',
                            overflowY: 'auto',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '-50px'}}>
                            <button onClick={toggleFilters} style={{
                                background: 'none',
                                border: 'none',
                                fontSize: 24,
                                cursor: 'pointer',
                                color: '#555',
                            }}>✕
                            </button>
                        </div>
                        <FilterPop/>
                    </div>
                </>
            )}
        </div>
    );
};

export default ExplorePage;
