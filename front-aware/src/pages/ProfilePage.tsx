import React from 'react';
import {FaEdit} from 'react-icons/fa';
import ProfileInfo from '../components/ProfilePage/ProfileInfo.tsx';
import Settings from '../components/ProfilePage/Settings.tsx';

const ProfilePage: React.FC = () => {
    const favoriteTopics = ['Lifestyle', 'Sport', 'Politics'];
    const language = 'English';
    const country = 'Romania';
    const dateJoined = 'March 2024';
    const name = 'Mirela Mirelascu';
    const email = 'mirelamirelascu@gmail.com';
    const bio = 'Passionate front-end developer, design enthusiast.';

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            padding: '10px',
            backgroundColor: '#f5f7fa',
        }}>
            <div style={{flex: 4}}>
                <ProfileInfo
                    favoriteTopics={favoriteTopics}
                    language={language}
                    country={country}
                    dateJoined={dateJoined}
                    name={name}
                    email={email}
                    bio={bio}
                />

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '20px'
                }}>
                    <button
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#031A6B',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                        onClick={() => alert('Edit profile clicked')}
                    >
                        <FaEdit style={{marginRight: '6px'}}/>
                        Edit Profile
                    </button>
                </div>
            </div>

            <div style={{flex: 6, padding: '20px', marginTop: '-20px'}}>
                <Settings/>
            </div>
        </div>
    );
};

export default ProfilePage;
