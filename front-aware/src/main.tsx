import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import './index.css';

import LandingPage from './pages/LandingPage.tsx';
import AuthPage from './pages/AuthPage.tsx';
import Layout from './pages/LayoutPage.tsx';
import HomePage from './pages/HomePage.tsx';
import ExplorePage from './pages/ExplorePage.tsx';
import BookmarksPage from './pages/BookmarksPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';

import SaveForLater from './components/BookmarksPage/SaveForLater.tsx';
import ArticlePage from "./pages/ArticlePage.tsx";
import ThreadPage from "./pages/ThreadPage.tsx";
import TopicPage from "./pages/TopicPage.tsx";

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/login" element={<AuthPage/>}/>
                <Route path="/register" element={<AuthPage/>}/>
                <Route path="/home" element={<Layout><HomePage/></Layout>}/>
                <Route path="/explore" element={<Layout><ExplorePage/></Layout>}/>
                <Route path="/profile" element={<Layout><ProfilePage/></Layout>}/>
                <Route path="/bookmarks" element={<Layout><BookmarksPage/></Layout>}>
                    <Route index element={<Navigate to="save-for-later"/>}/>
                    <Route path="save-for-later" element={<SaveForLater/>}/>
                    <Route path="/bookmarks/:folderName?" element={<Layout><BookmarksPage/></Layout>}/>

                </Route>
                <Route path="/article" element={<Layout><ArticlePage/></Layout>}/>
                <Route path="/thread" element={<Layout><ThreadPage/></Layout>}/>
                <Route path="/topic" element={<Layout><TopicPage/></Layout>}/>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
