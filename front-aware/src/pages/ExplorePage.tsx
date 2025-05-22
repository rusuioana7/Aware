import React, {useState} from 'react';
import SearchBar from '../components/ExplorePage/SearchBar';
import FilterPop from "../components/ExplorePage/Filter/FilterPop.tsx";
import {Filter} from 'lucide-react';

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
        <div style={{position: 'relative', height: '100vh', padding: '15px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px'}}>
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
