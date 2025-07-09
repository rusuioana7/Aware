import React from 'react';
import {Link} from 'react-router-dom';
import Button from '../components/Cards/Button.tsx';
import Header from '../components/Cards/PageLayout/Header.tsx';
import Footer from "../components/Cards/PageLayout/Footer.tsx";

const LandingPage: React.FC = () => {
    return (
        <div>
            <Header/>

            <section className="relative w-full h-[700px]">
                <img
                    src="/background.jpg"
                    alt="Landing Background"
                    className="absolute top-0 left-0 w-full h-full object-cover filter grayscale brightness-125 saturate-70 contrast-40"
                />

                <div
                    className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 flex flex-col items-center justify-center">
                    <h2
                        className="text-white font-bold text-center"
                        style={{
                            fontSize: '2.5rem',
                            lineHeight: '1.2',
                        }}
                    >
                        Stay updated. Stay informed.
                    </h2>

                    <div className="flex space-x-8 justify-center">
                        <Link to="/login">
                            <Button label="Log in"/>
                        </Link>
                        <Link to="/register">
                            <Button label="Get Started"/>
                        </Link>
                    </div>
                </div>
            </section>


            <div style={{marginTop: '-40px'}}>
                <Footer/>
            </div>


        </div>
    );
};

export default LandingPage;
