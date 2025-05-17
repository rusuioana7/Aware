import React from 'react';
import LatestNews from '../components/HomePage/LatestNews';
import SavedForLater from '../components/HomePage/SavedForLater';
import FeedOptions from '../components/HomePage/FeedOptions.tsx';
import Trending from '../components/HomePage/Trending';


const HomePage: React.FC = () => {
    return (
        <div style={{padding: '5px'}}>
            <LatestNews/>
            <SavedForLater/>

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
                <div style={{flex: 3}}>
                    <Trending/>
                </div>

                <div style={{flex: 7}}>
                    <FeedOptions/>
                </div>


            </div>
        </div>
    );
};

export default HomePage;
