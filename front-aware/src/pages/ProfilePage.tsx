import React, {useState} from 'react';
import {FaEdit} from 'react-icons/fa';
import ProfileInfo from '../components/ProfilePage/ProfileInfo.tsx';
import Settings from '../components/ProfilePage/Settings.tsx';
import EditProfile from '../components/ProfilePage/EditProfile.tsx';

const ProfilePage: React.FC = () => {
    const [profileData, setProfileData] = useState({
        favoriteTopics: ['Lifestyle', 'Sport', 'Politics'],
        language: 'English',
        country: 'Romania',
        dateJoined: 'March 2024',
        name: 'Mirela Mirelascu',
        email: 'mirelamirelascu@gmail.com',
        bio: 'Passionate front-end developer, design enthusiast.',
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleSave = (data: typeof profileData) => {
        setProfileData(data);
        setIsEditing(false);
    };

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            padding: '10px',
            backgroundColor: '#f5f7fa',
            position: 'relative'
        }}>
            <div style={{flex: 4}}>
                <ProfileInfo {...profileData} />
                <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
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
                        onClick={() => setIsEditing(true)}
                    >
                        <FaEdit style={{marginRight: '6px'}}/>
                        Edit Profile
                    </button>
                </div>
            </div>

            <div style={{flex: 6, padding: '20px', marginTop: '-20px'}}>
                <Settings/>
            </div>

            {isEditing && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 999
                }}>
                    <EditProfile
                        initialData={profileData}
                        onCancel={() => setIsEditing(false)}
                        onSave={handleSave}
                    />
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
