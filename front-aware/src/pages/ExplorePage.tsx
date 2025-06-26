import React, {useState} from 'react';
import SearchBar from '../components/ExplorePage/SearchBar';
import FilterPop from "../components/ExplorePage/Filter/FilterPop";
import DiscoverFeed from "../components/ExplorePage/Discover";
import {useNavigate} from 'react-router-dom';

const ExplorePage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const navigate = useNavigate();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const toggleFilters = () => {
        setShowFilters(prev => !prev);
    };

    const handleSearchSubmit = () => {
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <div style={{position: 'relative', padding: '15px'}}>
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
                    onSearch={handleSearchSubmit}
                    placeholder="Search articles, threads..."
                />

            </div>

            <div style={{
                display: 'flex',
                gap: '40px',
                marginBottom: '10px',
                borderBottom: '2px solid #ddd',
            }}>
                <h2 style={{fontSize: '25px', marginBottom: '10px'}}>Discover</h2>
            </div>

            <DiscoverFeed/>

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
