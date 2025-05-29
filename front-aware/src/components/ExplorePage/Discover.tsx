import React from 'react';
import { TOPIC_COLORS } from '../Cards/Tags/TagColor';
import TopicTag from '../Cards/Tags/TopicTag';

const Discover: React.FC = () => {
    return (
        <div style={{ display: 'flex', gap: '20px', padding: '0 15px', marginTop: '15px' }}>
            <div style={{ flex: 7 }}>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '20px' }}>Discover New Content</h2>
                <p style={{ color: '#666' }}>Discover</p>
            </div>

            <div style={{ flex: 3 }}>
                <h2 style={{ fontSize: '22px', marginBottom: '15px' }}>All Topics</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr',
                    gap: '12px 2px',
                }}>
                    {Object.keys(TOPIC_COLORS)
                        .filter(k => k !== 'all' && k !== 'general')
                        .map((key) => (
                            <TopicTag
                                key={key}
                                label={key}
                                style={{
                                    padding: '8px 12px',
                                    fontWeight: 'bold',
                                    fontSize: '15px',
                                }}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Discover;
