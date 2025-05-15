import React, { useState, useEffect, useRef } from 'react';

interface ZoomIfSmallProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    containerWidth: number;
    containerHeight: number;
}

const ZoomIfSmall: React.FC<ZoomIfSmallProps> = ({ containerWidth, containerHeight, style, ...props }) => {
    const [shouldZoom, setShouldZoom] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (imgRef.current) {
            const img = imgRef.current;
            if (img.naturalWidth < containerWidth || img.naturalHeight < containerHeight) {
                setShouldZoom(true);
            } else {
                setShouldZoom(false);
            }
        }
    }, [containerWidth, containerHeight, props.src]);

    return (
        <img
            {...props}
            ref={imgRef}
            style={{
                ...style,
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: shouldZoom ? 'scale(1.1)' : 'none',
                transition: 'transform 0.5s',
            }}
            alt={props.alt}
        />
    );
};

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
        },
        {
            title: 'Minimum Wage Increased in 15 Countries',
            date: '26 April 2025',
            src: '/news2.jpg',
            alt: 'Economy News',
        },
        {
            title: 'Tech Stocks Rebound Amid Optimism',
            date: '25 April 2025',
            src: '/news3.jpg',
            alt: 'Tech News',
        },
        {
            title: 'New Climate Policies Announced',
            date: '25 April 2025',
            src: '/news1.jpg',
            alt: 'Climate News',
        },
    ];

    return (
        <div style={{ padding: '16px', marginTop: '-20px' }}>
            <p style={{ fontSize: '22px', color: '#000000', marginTop: '30px', marginBottom: '16px' }}>
                Latest News For You
            </p>

            <div style={{ display: 'flex', gap: '0' }}>
                <div style={{ padding: '4px', width: '50%', height: `${largeCardHeight}px` }}>
                    <div
                        className="relative rounded overflow-hidden shadow-md bg-white"
                        style={{ width: '100%', height: '100%' }}
                    >
                        <ZoomIfSmall
                            src="/news1.jpg"
                            alt="Marathon World Record"
                            containerWidth={containerWidth}
                            containerHeight={largeCardHeight}
                            className="rounded"
                        />
                        <div className="absolute bottom-0 left-0 p-4 text-white bg-gradient-to-t from-black/70 to-transparent w-full">
                            <p className="text-lg font-semibold">Marathon World Record Broken in Berlin</p>
                            <p className="text-sm">26 April 2025</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 grid-rows-2" style={{ width: '50%' }}>
                    {newsItems.map((item, idx) => (
                        <div key={idx} style={{ padding: '4px', height: `${smallCardHeight}px` }}>
                            <div className="relative h-full rounded overflow-hidden shadow-md bg-white w-full">
                                <ZoomIfSmall
                                    src={item.src}
                                    alt={item.alt}
                                    containerWidth={containerWidth}
                                    containerHeight={smallCardHeight}
                                    className="rounded"
                                />
                                <div className="absolute bottom-0 left-0 p-2 text-white bg-gradient-to-t from-black/70 to-transparent w-full">
                                    <p className="text-[10px]">{item.date}</p>
                                    <p className="text-xs font-semibold leading-tight">{item.title}</p>
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
