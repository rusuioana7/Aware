import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';

import LatestNews from '../components/HomePage/LatestNews';
import SavedForLater from '../components/HomePage/SavedForLater';
import FeedOptions from '../components/HomePage/Feed/FeedOptions.tsx';
import Trending from '../components/HomePage/Side/Trending.tsx';
import TopPicks from '../components/HomePage/Side/TopPicks.tsx';
import ThreadsYouFollow from "../components/HomePage/Side/ThreadsYouFollow.tsx";
import ActiveThreads from "../components/HomePage/Side/ActiveThreads.tsx";
import Feed from '../components/HomePage/Feed/Feed.tsx';

const HomePage: React.FC = () => {
    const location = useLocation();
    const [view, setView] = useState<'All' | 'Articles' | 'Threads'>('All');


    useEffect(() => {
        if (location.hash) {
            const id = location.hash.slice(1); // remove the #
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({behavior: 'smooth', block: 'start'});
            }
        }
    }, [location]);

    return (
        <div style={{padding: '5px'}}>
            <div id="latest">
                <LatestNews/>
            </div>

            <div id="saved">
                <SavedForLater/>
            </div>

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
                    <div id="trending">
                        <Trending/>
                    </div>
                    <div id="toppicks">
                        <TopPicks/>
                    </div>
                    <div id="followedthreads">
                        <ThreadsYouFollow/>
                    </div>
                    <div id="activethreads">
                        <ActiveThreads/>
                    </div>
                </div>

                <div style={{flex: 7}}>
                    <div id="feed">
                        <FeedOptions onViewChange={setView}/>
                        <Feed selectedView={view}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
