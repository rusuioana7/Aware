import React from 'react';
import TopicTag from '../components/Cards/Tags/TopicTag';

const ProfilePage: React.FC = () => {
    const favoriteTopics = ['Lifestyle', 'Sport', 'Politics'];
    const language = 'English';
    const country = 'Romania';
    const dateJoined = 'March 2024'

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            padding: '10px',
            backgroundColor: '#f5f7fa',
        }}>
            <div style={{
                flex: 3,
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                paddingBottom: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                marginRight: '20px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    height: '120px',
                    backgroundImage: "url('/news1.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}></div>

                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '4px solid white',
                    position: 'absolute',
                    top: '90px',
                    left: '20px',
                    backgroundColor: '#ccc',
                }}>
                    <img
                        src="/news2.jpg"
                        alt="Profile"
                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                    />
                </div>

                <div style={{marginTop: '5px', marginLeft: '140px', padding: '10px'}}>
                    <h2 style={{margin: 0, color: '#031A6B'}}>Mirela Mirelascu</h2>
                    <p style={{marginTop: '5px', color: '#031A6B'}}>mirelamirelascu@gmail.com</p>
                </div>

                <div style={{marginTop: '5px', marginLeft: '20px', padding: '10px'}}>
                    <p style={{
                        marginTop: '-15px',
                        fontSize: '17px',
                        color: '#666',
                        lineHeight: 1.4,
                        maxWidth: '97%',
                        textAlign: 'center'
                    }}>
                        Passionate front-end developer, design enthusiast.
                    </p>
                </div>

                <hr style={{
                    margin: '0 10px',
                    border: 'none',
                    borderTop: '1px solid #ddd'
                }}/>

                <div style={{padding: '0 30px', marginTop: '20px'}}>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '10px',
                        marginBottom: '12px'
                    }}>
                        <span style={{color: '#031A6B', fontSize: '18px', fontWeight: 600}}>Favorite Topics:</span>
                        {favoriteTopics.map((topic) => (
                            <TopicTag key={topic} label={topic}/>
                        ))}
                    </div>

                    <p style={{margin: '10px 0', color: '#031A6B', fontSize: '18px'}}>
                        <strong>Language:</strong> {language}
                    </p>
                    <p style={{margin: '10px 0', color: '#031A6B', fontSize: '18px'}}>
                        <strong>Country:</strong> {country}
                    </p>
                    <p style={{margin: '10px 0', color: '#031A6B', fontSize: '18px'}}>
                        <strong>Date Joined:</strong> {dateJoined}
                    </p>
                </div>


            </div>

            <div style={{
                flex: 7,
                padding: '20px',
            }}>
                <h2 style={{color: 'black'}}>Settings</h2>

            </div>
        </div>
    );
};

export default ProfilePage;
