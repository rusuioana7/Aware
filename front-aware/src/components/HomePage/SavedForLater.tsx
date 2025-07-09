import React, {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import ZoomIfSmall from './ZoomIfSmallPicture';
import TopicTag from '../Cards/Tags/TopicTag.tsx';
import ArticleOptions from '../Cards/ArticleLayouts/ArticleOptions.tsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowLeft, faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {BASE_URL} from '../../api/config.ts';

const smallCardHeight = 170;
const containerWidth = 300;
const cardGap = 8;
const scrollStep = containerWidth + cardGap;
const autoScrollInterval = 3000;

interface SavedArticle {
    _id: string;
    title: string;
    author?: string;
    published: string;
    image?: string;
    topics?: string[];
    source: string;
}

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

const SavedForLater: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [hovering, setHovering] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);

    useEffect(() => {
        const fetchSaved = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            try {
                const res = await fetch(`${BASE_URL}/bookmarks/save-for-later`, {
                    headers: {Authorization: `Bearer ${token}`},
                });
                const data = await res.json();
                setSavedArticles(data.articles || []);
            } catch (err) {
                console.error('Error fetching saved articles:', err);
            }
        };

        fetchSaved();
    }, []);

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

    const scrollLeft = () =>
        scrollRef.current?.scrollBy({left: -scrollStep, behavior: 'smooth'});
    const scrollRight = () =>
        scrollRef.current?.scrollBy({left: scrollStep, behavior: 'smooth'});

    return (
        <div
            style={{paddingLeft: '15px', paddingRight: '15px', marginTop: '20px'}}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            <p
                style={{
                    fontSize: '22px',
                    fontWeight: 'bold',
                    color: '#000000',
                    marginTop: '20px',
                    marginBottom: '16px',
                    marginLeft: '3px',
                }}
            >
                Saved for Later
            </p>

            <div style={{position: 'relative', marginLeft: '3px'}}>
                {savedArticles.length === 0 ? (
                    <div
                        style={{
                            padding: '20px',
                            textAlign: 'center',
                            color: '#666',
                            fontStyle: 'italic',
                            fontSize: '16px',
                        }}
                    >
                        No articles in Saved for Later.
                    </div>
                ) : (
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
                    {savedArticles.map((item, idx) => (
                        <div
                            key={item._id}
                            style={{
                                height: `${smallCardHeight}px`,
                                minWidth: `${containerWidth}px`,
                                width: `${containerWidth}px`,
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                backgroundColor: 'white',
                                flexShrink: 0,
                            }}
                            onMouseEnter={() => setHoveredIndex(idx)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {hoveredIndex === idx && (
                                <div style={{position: 'absolute', top: '8px', right: '8px', zIndex: 10}}>
                                    <ArticleOptions articleId={item._id} position="top-right"/>
                                </div>
                            )}

                            <Link
                                to={`/article/${item._id}`}
                                style={{
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    display: 'block',
                                    height: '100%',
                                    width: '100%',
                                    position: 'relative',
                                }}
                            >
                                <ZoomIfSmall
                                    src={item.image || '/default.jpg'}
                                    alt={item.title}
                                    containerWidth={containerWidth}
                                    containerHeight={smallCardHeight}
                                    className="rounded"
                                />

                                <div style={{position: 'absolute', top: '8px', left: '8px', zIndex: 3}}>
                                    <TopicTag label={item.topics?.[0] || 'general'}/>
                                </div>

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

                                <div
                                    style={{
                                        position: 'absolute',
                                        bottom: '12px',
                                        left: '8px',
                                        zIndex: 2,
                                        color: 'white',
                                        maxWidth: '90%',
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: '17px',
                                            fontWeight: 'bold',
                                            margin: '3px 0',
                                            lineHeight: '1.1',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {item.title}
                                    </p>
                                    <p style={{fontSize: '12px', margin: 0}}>
                                        {item.author || 'Unknown'} •{' '}
                                        {new Date(item.published).toLocaleDateString()}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
                )}

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

export default SavedForLater;
