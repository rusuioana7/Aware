import React from 'react';
import Header from '../components/Cards/Header.tsx';
import Menu from '../components/Cards/Menu.tsx';


const LayoutPage: React.FC<{ children: React.ReactNode }> = ({children}) => {
    return (
        <>
            <Header/>
            <Menu/>
            <div style={{padding: '20px'}}>{children}</div>
        </>
    );
};

export default LayoutPage;