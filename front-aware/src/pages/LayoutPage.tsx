import React from 'react';
import Header from '../components/Cards/PageLayout/Header.tsx';
import Menu from '../components/Cards/PageLayout/Menu.tsx';
import Footer from "../components/Cards/PageLayout/Footer.tsx";


const LayoutPage: React.FC<{ children: React.ReactNode }> = ({children}) => {
    return (
        <>
            <Header/>
            <Menu/>
            <div style={{padding: '20px'}}>{children}</div>
            <Footer/>
        </>
    );
};

export default LayoutPage;