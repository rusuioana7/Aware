import React, {useState} from 'react';
import Toggle from './Toggle';
import CredentialsForm from './CredentialsForm';
import Divider from './Divider';
import GoogleLoginButton from './GoogleLoginButton';

const Container: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

    const handleTabChange = (tab: 'login' | 'signup') => {
        setActiveTab(tab);
    };

    return (
        <div
            className="w-full max-w-[480px] h-[580px] p-6 rounded-[25px] bg-[#D9D9D9] flex flex-col items-center justify-start mx-auto">
            <h2 className="text-[40px] font-bold text-[#031A6B] mb-6">Welcome!</h2>

            <Toggle activeTab={activeTab} onTabChange={handleTabChange}/>

            <CredentialsForm/>

            <Divider/>

            <GoogleLoginButton/>
        </div>
    );
};

export default Container;
