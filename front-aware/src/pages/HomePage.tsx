import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';

import LatestNews from '../components/HomePage/LatestNews';
import SavedForLater from '../components/HomePage/SavedForLater';
import FeedOptions from '../components/HomePage/Feed/FeedOptions.tsx';
import Trending from '../components/HomePage/Side/Trending.tsx';
import ThreadsYouFollow from "../components/HomePage/Side/ThreadsYouFollow.tsx";
import ActiveThreads from "../components/HomePage/Side/ActiveThreads.tsx";
import Feed from '../components/HomePage/Feed/Feed.tsx';
import RecentlyViewed from "../components/HomePage/Side/RecentlyViewed.tsx";

const HomePage: React.FC = () => {
    const location = useLocation();
    const [view, setView] = useState<'All' | 'Articles' | 'Threads'>('All');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('accessToken');
        if (token) {
            localStorage.setItem('authToken', token);

            params.delete('accessToken');
            const newSearch = params.toString();
            const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '');
            window.history.replaceState({}, '', newUrl);
        }
    }, []);


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
                    <div id="activethreads">
                        <ActiveThreads/>
                    </div>
                    <div id="recentlyviewed">
                        <RecentlyViewed/>
                    </div>
                    <div id="followedthreads">
                        <ThreadsYouFollow/>
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
