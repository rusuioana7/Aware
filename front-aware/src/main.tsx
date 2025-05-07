import React from 'react';
import ReactDOM from 'react-dom/client'; // Note the use of 'react-dom/client'
import './index.css';  // Your global styles
import LandingPage from './pages/LandingPage.tsx'; // Import LandingPage component

// Create a root element and render the LandingPage component
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <LandingPage />
    </React.StrictMode>
);