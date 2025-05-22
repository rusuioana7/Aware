import React, {useState} from 'react';
import SearchBar from '../components/ExplorePage/SearchBar';
import SideFilter from "../components/ExplorePage/Filter/SideFilter.tsx";

const ExplorePage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div style={{display: 'flex', height: '100vh'}}>
            <div style={{flex: 7, padding: '15px', marginTop: '10px', borderRight: '1px solid #eee'}}>

                <SearchBar
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search articles, threads..."
                />
            </div>

            <div style={{flex: 3, padding: '15px', marginTop: '-20px'}}>
                <SideFilter/>

            </div>
        </div>
    );
};

export default ExplorePage;
