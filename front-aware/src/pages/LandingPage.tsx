import React from 'react';
import {Link} from 'react-router-dom';
import Button from '../components/Cards/Button.tsx';
import Header from '../components/Cards/PageLayout/Header.tsx';
import ImageSection from "../components/LandingPage/ImageSection.tsx";
import TextSection from "../components/LandingPage/TextSection.tsx";

const LandingPage: React.FC = () => {
    return (
        <div>
            <Header/>

            <section className="relative w-full h-[500px]">
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

            <section className="w-full px-6 py-12 bg-[#f3f3f3]">

                <h3 className="font-bold text-center mb-12" style={{fontSize: '2rem'}}>
                    HOW DOES IT WORK?
                </h3>


                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-10">

                    <TextSection
                        title="HOW DOES IT WORK?"
                        content="Our app brings you the latest news from trusted sources, while ensuring the accuracy of every article with real-time fact-checking. Personalized news, reliable information, and a fake news tracker – all in one place."
                    />

                    <ImageSection
                        imageSrc="/landing.png"
                        altText="How it works"
                    />

                </div>
            </section>


        </div>
    );
};

export default LandingPage;
