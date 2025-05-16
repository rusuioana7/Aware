import React from 'react';
import LatestNews from '../components/HomePage/LatestNews';
import SavedForLater from '../components/HomePage/SavedForLater';
import Feed from '../components/HomePage/Feed';
import Trending from '../components/HomePage/Trending';


const HomePage: React.FC = () => {
    return (
        <div style={{ padding: '5px'}}>
            <LatestNews />
            <SavedForLater />

            <div
                style={{
                    padding: '5px',
                    display: 'flex',
                    gap: '24px',
                    paddingLeft: '18px',
                    paddingRight: '15px',
                    marginTop: '20px',
                    alignItems: 'flex-start',
                }}
            >
                <div style={{ flex: 3 }}>
                    <Trending/>
                </div>

                <div style={{ flex: 7 }}>
                    <Feed />
                </div>


            </div>
        </div>
    );
};

export default HomePage;
