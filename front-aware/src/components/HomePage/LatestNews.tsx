import React, {useState} from "react";
import ZoomIfSmall from './ZoomIfSmallPicture';
import TopicTag from '../Cards/Tags/TopicTag.tsx';
import ArticleOptions from '../Cards/ArticleOptions.tsx';

const LatestNews: React.FC = () => {
    const largeCardHeight = 392;
    const smallCardHeight = 192;
    const containerWidth = 256;

    const newsItems = [
        {
            title: 'Severe Flu Strain Emerging in Asia',
            date: '26 April 2025',
            src: '/news1.jpg',
            alt: 'Health News',
            tag: 'Health',
        },
        {
            title: 'Minimum Wage Increased in 15 Countries',
            date: '26 April 2025',
            src: '/news2.jpg',
            alt: 'Economy News',
            tag: 'Economy',
        },
        {
            title: 'Tech Stocks Rebound Amid Optimism',
            date: '25 April 2025',
            src: '/news3.jpg',
            alt: 'Tech News',
            tag: 'Tech',
        },
        {
            title: 'New Climate Policies Announced',
            date: '25 April 2025',
            src: '/news1.jpg',
            alt: 'Climate News',
            tag: 'Climate',
        },
    ];

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div style={{padding: '15px', marginTop: '-20px'}}>
            <p style={{
                fontSize: '22px',
                fontWeight: 'bold',
                color: '#000',
                marginTop: '10px',
                marginBottom: '16px',
                marginLeft: '3px',
            }}>
                Latest News For You
            </p>

            <div style={{display: 'flex'}}>
                <div style={{padding: '4px', width: '50%', height: `${largeCardHeight}px`}}>
                    <div
                        style={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            overflow: 'hidden',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                            backgroundColor: '#fff',
                        }}
                        onMouseEnter={() => setHoveredIndex(-1)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <ZoomIfSmall
                            src="/news1.jpg"
                            alt="Marathon World Record"
                            containerWidth={containerWidth}
                            containerHeight={largeCardHeight}
                        />

                        {hoveredIndex === -1 && (
                            <div style={{position: 'absolute', top: '10px', right: '10px', zIndex: 2}}>
                                <ArticleOptions position="top-right"/>
                            </div>
                        )}

                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            zIndex: 1,
                            pointerEvents: 'none',
                        }}/>

                        <TopicTag label="Sport" style={{position: 'absolute', top: '12px', left: '12px', zIndex: 2}}/>
                        <div style={{position: 'absolute', bottom: '16px', left: '16px', zIndex: 2, color: '#fff'}}>
                            <p style={{fontSize: '24px', fontWeight: 'bold', margin: 0}}>
                                Marathon World Record Broken in Berlin
                            </p>
                            <p style={{fontSize: '15px', margin: '4px 0 0 0'}}>26 April 2025</p>
                        </div>
                    </div>
                </div>

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', width: '50%'}}>
                    {newsItems.map((item, idx) => (
                        <div key={idx} style={{padding: '4px', height: `${smallCardHeight}px`}}>
                            <div
                                style={{
                                    position: 'relative',
                                    width: '100%',
                                    height: '100%',
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                    backgroundColor: '#fff',
                                }}
                                onMouseEnter={() => setHoveredIndex(idx)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <ZoomIfSmall
                                    src={item.src}
                                    alt={item.alt}
                                    containerWidth={containerWidth}
                                    containerHeight={smallCardHeight}
                                />

                                {hoveredIndex === idx && (
                                    <div style={{position: 'absolute', top: '10px', right: '10px', zIndex: 2}}>
                                        <ArticleOptions position="top-right"/>
                                    </div>
                                )}

                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                    zIndex: 1,
                                    pointerEvents: 'none',
                                }}/>

                                <TopicTag
                                    label={item.tag}
                                    style={{position: 'absolute', top: '12px', left: '12px', zIndex: 2}}
                                />
                                <div style={{
                                    position: 'absolute',
                                    bottom: '2px',
                                    left: '8px',
                                    zIndex: 2,
                                    color: '#fff'
                                }}>
                                    <p style={{
                                        fontSize: '17px',
                                        fontWeight: 'bold',
                                        margin: 0,
                                        lineHeight: '1.1'
                                    }}>
                                        {item.title}
                                    </p>
                                    <p style={{fontSize: '12px', marginTop: '3px'}}>{item.date}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LatestNews;
