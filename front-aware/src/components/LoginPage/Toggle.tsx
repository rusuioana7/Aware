import React from 'react';

interface ToggleProps {
    activeTab: 'login' | 'signup';
    onTabChange: (tab: 'login' | 'signup') => void;
}

const Toggle: React.FC<ToggleProps> = ({activeTab, onTabChange}) => {
    return (
        <div className="flex justify-center gap-6 mt-6 flex-wrap">
            <button
                onClick={() => onTabChange('login')}
                style={{
                    backgroundColor: activeTab === 'login' ? '#031A6B' : '#E6E6E6',
                    color: activeTab === 'login' ? '#FFFFFF' : '#031A6B',
                    padding: '12px 24px',
                    fontSize: '18px',
                    fontWeight: '600',
                    borderRadius: '8px',
                    border: 'none',
                    width: '45%',
                    minWidth: '150px',
                    maxWidth: '200px',
                }}
            >
                Login
            </button>
            <button
                onClick={() => onTabChange('signup')}
                style={{
                    backgroundColor: activeTab === 'signup' ? '#031A6B' : '#E6E6E6',
                    color: activeTab === 'signup' ? '#FFFFFF' : '#031A6B',
                    padding: '12px 24px',
                    fontSize: '18px',
                    fontWeight: '600',
                    borderRadius: '8px',
                    border: 'none',
                    width: '45%',
                    minWidth: '150px',
                    maxWidth: '200px',
                }}
            >
                Sign Up
            </button>
        </div>
    );
};

export default Toggle;
