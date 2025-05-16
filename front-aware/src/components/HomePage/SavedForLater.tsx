import React, {useRef, useEffect, useState} from 'react';
import ZoomIfSmall from './ZoomIfSmallPicture';
import TopicTag from './TopicTag';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowLeft, faArrowRight} from '@fortawesome/free-solid-svg-icons';

const smallCardHeight = 170;
const containerWidth = 300;
const cardGap = 8;
const scrollStep = containerWidth + cardGap;
const autoScrollInterval = 3000;

const savedItems = [
    {
        title: 'Doctors Warn of New Flu Strain Emerging in Asia',
        date: '26 April 2025',
        src: '/news1.jpg',
        alt: 'Health News',
        topic: 'health',
    },
    {
        title: 'Minimum Wage Increased in 25 Countries',
        date: '30 April 2025',
        src: '/news2.jpg',
        alt: 'Economy News',
        topic: 'economy',
    },
    {
        title: 'Minimum Wage Increased in 25 Countries',
        date: '30 April 2025',
        src: '/news2.jpg',
        alt: 'Economy News',
        topic: 'economy',
    },
    {
        title: 'Minimum Wage Increased in 25 Countries',
        date: '30 April 2025',
        src: '/news2.jpg',
        alt: 'Economy News',
        topic: 'economy',
    },
    {
        title: 'Minimum Wage Increased in 25 Countries',
        date: '30 April 2025',
        src: '/news2.jpg',
        alt: 'Economy News',
        topic: 'economy',
    },
];

const SavedForLater: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [hovering, setHovering] = useState(false);

    useEffect(() => {
        if (hovering) return;

        const interval = setInterval(() => {
            if (!scrollRef.current) return;

            const {scrollLeft, scrollWidth, clientWidth} = scrollRef.current;
            if (scrollLeft + clientWidth >= scrollWidth) {
                scrollRef.current.scrollTo({left: 0, behavior: 'smooth'});
            } else {
                scrollRef.current.scrollBy({left: scrollStep, behavior: 'smooth'});
            }
        }, autoScrollInterval);

        return () => clearInterval(interval);
    }, [hovering]);

    const scrollLeft = () => scrollRef.current?.scrollBy({left: -scrollStep, behavior: 'smooth'});
    const scrollRight = () => scrollRef.current?.scrollBy({left: scrollStep, behavior: 'smooth'});

    return (
        <div style={{paddingLeft: '15px', paddingRight: '15px', marginTop: '20px'}}
             onMouseEnter={() => setHovering(true)}
             onMouseLeave={() => setHovering(false)}
        >
            <p style={{
                fontSize: '22px',
                fontWeight: 'bold',
                color: '#000000',
                marginTop: '20px',
                marginBottom: '16px',
                marginLeft: '3px',
            }}>
                Saved for Later
            </p>

            <div style={{position: 'relative', marginLeft: '3px'}}>
                <div
                    ref={scrollRef}
                    style={{
                        display: 'flex',
                        gap: `${cardGap}px`,
                        overflowX: 'auto',
                        scrollBehavior: 'smooth',
                        paddingBottom: '8px',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        height: `${smallCardHeight}px`,
                    }}
                    className="hide-scrollbar"
                >
                    {savedItems.map((item, idx) => (
                        <div key={idx} style={{
                            height: `${smallCardHeight}px`,
                            minWidth: `${containerWidth}px`,
                            width: `${containerWidth}px`,
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            backgroundColor: 'white',
                            flexShrink: 0,
                        }}>
                            <ZoomIfSmall
                                src={item.src}
                                alt={item.alt}
                                containerWidth={containerWidth}
                                containerHeight={smallCardHeight}
                                className="rounded"
                            />


                            <div style={{position: 'absolute', top: '8px', left: '8px', zIndex: 3}}>
                                <TopicTag label={item.topic || 'general'}/>

                            </div>

                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                pointerEvents: 'none',
                                borderRadius: 'inherit',
                                zIndex: 1,
                            }}/>

                            <div style={{
                                position: 'absolute',
                                bottom: '12px',
                                left: '8px',
                                zIndex: 2,
                                color: 'white',
                            }}>
                                <p style={{
                                    fontSize: '17px',
                                    fontWeight: 'bold',
                                    margin: '3px 0 0 0',
                                    lineHeight: '1.1',
                                }}>
                                    {item.title}
                                </p>
                                <p style={{fontSize: '12px', margin: '3px 0 0 0'}}>{item.date}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {hovering && (
                    <>
                        <button onClick={scrollLeft} style={arrowStyle('left')}>
                            <FontAwesomeIcon icon={faArrowLeft}/>
                        </button>
                        <button onClick={scrollRight} style={arrowStyle('right')}>
                            <FontAwesomeIcon icon={faArrowRight}/>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

const arrowStyle = (side: 'left' | 'right') => ({
    position: 'absolute' as const,
    top: '50%',
    [side]: '-42px',
    transform: 'translateY(-50%)',
    background: 'rgba(0,0,0,0.5)',
    border: 'none',
    borderRadius: '50%',
    color: 'white',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '17px',
});

export default SavedForLater;
