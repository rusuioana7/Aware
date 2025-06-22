import React, {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';

import LatestNews from '../components/HomePage/LatestNews';
import SavedForLater from '../components/HomePage/SavedForLater';
import FeedOptions from '../components/HomePage/Feed/FeedOptions.tsx';
import Trending from '../components/HomePage/Side/Trending.tsx';
import ThreadsYouFollow from "../components/HomePage/Side/ThreadsYouFollow.tsx";
import ActiveThreads from "../components/HomePage/Side/ActiveThreads.tsx";
import Feed from '../components/HomePage/Feed/Feed.tsx';
import RecentlyViewed from "../components/HomePage/Side/RecentlyViewed.tsx";

import {BASE_URL} from '../api/config.ts';

const HomePage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const viewParam = (searchParams.get('view') as 'All' | 'Articles' | 'Threads') || 'All';
    const sortParam = (searchParams.get('sort') as 'Newest' | 'Popular' | 'Verified Only') || 'Newest';
    const topicParam = searchParams.get('topics')?.split(',').filter(Boolean) || [];
    const langParam = searchParams.get('languages')?.split(',').filter(Boolean) || [];

    const [view, setView] = useState(viewParam);
    const [sort, setSort] = useState(sortParam);
    const [selectedTopics, setSelectedTopics] = useState<string[]>(topicParam);
    const [userPrefs, setUserPrefs] = useState<{ topics: string[], languages: string[] }>({
        topics: topicParam,
        languages: langParam
    });


    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get('accessToken');
        if (token) {
            localStorage.setItem('authToken', token);
            searchParams.delete('accessToken');
            setSearchParams(searchParams);
        }
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            try {
                const res = await fetch(`${BASE_URL}/users/me`, {
                    headers: {Authorization: `Bearer ${token}`}
                });
                const user = await res.json();
                const topics = user.favoriteTopics || [];
                const languages = user.language || [];

                if (!searchParams.get('topics') && topics.length) {
                    searchParams.set('topics', topics.join(','));
                    setSearchParams(searchParams);
                    setSelectedTopics(topics);
                }
                if (!searchParams.get('languages') && languages.length) {
                    searchParams.set('languages', languages.join(','));
                    setSearchParams(searchParams);
                }

                setUserPrefs({topics, languages});
            } catch (err) {
                console.error('[fetchProfile] Failed to fetch user:', err);
            }
        };

        fetchProfile();
    }, []);


    useEffect(() => {
        if (location.hash) {
            const id = location.hash.slice(1);
            const element = document.getElementById(id);
            if (element) element.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    }, [location]);

    const hasPrefs = selectedTopics.length > 0 && userPrefs.languages.length > 0;

    return (
        <div style={{padding: '5px'}}>
            <div id="latest"><LatestNews/></div>
            <div id="saved"><SavedForLater/></div>

            <div style={{
                padding: '5px',
                display: 'flex',
                gap: '24px',
                paddingLeft: '18px',
                paddingRight: '15px',
                marginTop: '20px',
                alignItems: 'flex-start'
            }}>
                <div style={{flex: 3}}>
                    <Trending/>
                    <ActiveThreads/>
                    <RecentlyViewed/>
                    <ThreadsYouFollow/>
                </div>

                <div style={{flex: 7}}>
                    <div id="feed">
                        <FeedOptions
                            onViewChange={setView}
                            onTopicChange={setSelectedTopics}
                            onSortChange={setSort}
                        />

                        {hasPrefs ? (
                            <Feed
                                selectedView={view}
                                selectedTopics={selectedTopics}
                                selectedLanguages={userPrefs.languages}
                                selectedSort={sort}
                            />
                        ) : (
                            <div style={{padding: 16, color: '#888'}}>Loading personalized feed...</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
