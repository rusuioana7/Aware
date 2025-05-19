import React, {useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import Toggle from './Toggle';
import CredentialsForm from './CredentialsForm';
import Divider from './Divider';
import GoogleButton from './GoogleButton.tsx';

const Container: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

    useEffect(() => {
        // Set initial state based on URL
        if (location.pathname === '/register') {
            setActiveTab('signup');
        } else {
            setActiveTab('login');
        }
    }, [location.pathname]);

    const handleTabChange = (tab: 'login' | 'signup') => {
        setActiveTab(tab);
        navigate(tab === 'login' ? '/login' : '/register');
    };

    return (
        <div
            className="w-full max-w-[480px] h-[580px] p-6 rounded-[25px] bg-[#D9D9D9] flex flex-col items-center justify-start mx-auto">
            <h2 className="text-[40px] font-bold text-[#031A6B] mb-6">Welcome!</h2>

            <Toggle activeTab={activeTab} onTabChange={handleTabChange}/>

            <CredentialsForm mode={activeTab}/>

            <Divider/>

            <GoogleButton/>
        </div>
    );
};

export default Container;
