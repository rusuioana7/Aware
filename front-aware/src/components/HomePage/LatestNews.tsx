import React from "react";
import ZoomIfSmall from './ZoomIfSmallPicture';
import TopicTag from './TopicTag';

const LatestNews: React.FC = () => {
    const largeCardHeight = 391;
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

    return (
        <div style={{padding: '15px', marginTop: '-20px'}}>
            <p
                className="font-sans"
                style={{
                    fontSize: '22px',
                    fontWeight: 'bold',
                    color: '#000000',
                    marginTop: '20px',
                    marginBottom: '16px',
                    marginLeft: '3px',
                }}
            >
                Latest News For You
            </p>

            <div style={{display: 'flex', gap: '0'}}>
                <div style={{padding: '4px', width: '50%', height: `${largeCardHeight}px`}}>
                    <div
                        className="relative rounded overflow-hidden shadow-md bg-white"
                        style={{width: '100%', height: '100%', position: 'relative'}}
                    >
                        <ZoomIfSmall
                            src="/news1.jpg"
                            alt="Marathon World Record"
                            containerWidth={containerWidth}
                            containerHeight={largeCardHeight}
                            className="rounded"
                        />
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                pointerEvents: 'none',
                                borderRadius: 'inherit',
                                zIndex: 1,
                            }}
                        />
                        <TopicTag
                            label="Sport"
                            style={{
                                position: 'absolute',
                                top: '12px',
                                left: '12px',
                                zIndex: 2,
                            }}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                bottom: '16px',
                                left: '16px',
                                zIndex: 2,
                                color: 'white',
                            }}
                        >
                            <p style={{fontSize: '24px', fontWeight: 'bold', margin: 0}}>
                                Marathon World Record Broken in Berlin
                            </p>
                            <p style={{fontSize: '15px', margin: '4px 0 0 0'}}>26 April 2025</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 grid-rows-2" style={{width: '50%'}}>
                    {newsItems.map((item, idx) => (
                        <div key={idx} style={{padding: '4px', height: `${smallCardHeight}px`}}>
                            <div className="relative h-full rounded overflow-hidden shadow-md bg-white w-full"
                                 style={{position: 'relative'}}>
                                <ZoomIfSmall
                                    src={item.src}
                                    alt={item.alt}
                                    containerWidth={containerWidth}
                                    containerHeight={smallCardHeight}
                                    className="rounded"
                                />
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                        pointerEvents: 'none',
                                        borderRadius: 'inherit',
                                        zIndex: 1,
                                    }}
                                />
                                <TopicTag
                                    label={item.tag}
                                    style={{
                                        position: 'absolute',
                                        top: '12px',
                                        left: '12px',
                                        zIndex: 2,
                                    }}
                                />
                                <div
                                    style={{
                                        position: 'absolute',
                                        bottom: '12px',
                                        left: '8px',
                                        zIndex: 2,
                                        color: 'white',
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: '17px',
                                            fontWeight: 'bold',
                                            margin: '3px 0 0 0',
                                            lineHeight: '1.1',
                                        }}
                                    >
                                        {item.title}
                                    </p>
                                    <p style={{fontSize: '12px', margin: '3px 0 0 0'}}>{item.date}</p>
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
