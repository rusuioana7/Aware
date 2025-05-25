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
import MyProfilePage from './pages/MyProfilePage.tsx';

import SaveForLater from './components/BookmarksPage/SaveForLater.tsx';

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
                <Route path="/profile" element={<Layout><MyProfilePage/></Layout>}/>

                <Route path="/bookmarks" element={<Layout><BookmarksPage/></Layout>}>
                    <Route index element={<Navigate to="save-for-later"/>}/>
                    <Route path="save-for-later" element={<SaveForLater/>}/>
                    <Route path="/bookmarks/:folderName?" element={<Layout><BookmarksPage/></Layout>}/>

                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
