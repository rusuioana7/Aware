import React, {useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import EditProfile, {type ProfileData} from '../components/ProfilePage/EditProfile';

const CreateProfilePage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const {email: registeredEmail} = (location.state as { email?: string }) || {};

    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [isEditing, setIsEditing] = useState(true);

    useEffect(() => {
        if (registeredEmail) {
            const emptyProfile: ProfileData = {
                email: registeredEmail,
                name: '',
                bio: '',
                favoriteTopics: [],
                language: '',
                country: '',
                profilePhoto: '/default-avatar.png',
                bannerPhoto: '',
                dateJoined: new Date().toISOString(),
            };
            setProfileData(emptyProfile);
            return;
        }

        fetch('http://localhost:3001/users/me', {
            credentials: 'include',
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Not authenticated');
                }
                return res.json();
            })
            .then(data => {
                const emptyProfile: ProfileData = {
                    email: data.email || '',
                    name: '',
                    bio: '',
                    favoriteTopics: [],
                    language: '',
                    country: '',
                    profilePhoto: '/default-avatar.png',
                    bannerPhoto: '',
                    dateJoined: data.createdAt || '',
                };
                setProfileData(emptyProfile);
            })
            .catch(() => {
                navigate('/login');
            });
    }, [registeredEmail, navigate]);

    if (!profileData) {
        return <div style={{color: 'white', textAlign: 'center', marginTop: '2rem'}}>Loading profile...</div>;
    }

    const handleSave = async (updatedData: ProfileData) => {
        try {
            const {name, bio, favoriteTopics, language, country, profilePhoto, bannerPhoto} = updatedData;
            const payload = {name, bio, favoriteTopics, language, country, profilePhoto, bannerPhoto};

            const res = await fetch('http://localhost:3001/users/profile', {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to save profile: ${errorText}`);
            }

            const savedProfile = await res.json();
            setProfileData(prev => ({...(prev || {}), ...savedProfile}));
            setIsEditing(false);

            navigate('/home');
        } catch (err) {
            console.error('Error saving profile:', err);
            alert('Error saving profile. Please try again.');
        }
    };

    return (
        <div className="flex h-screen w-full" style={{backgroundColor: '#031A6B'}}>
            {isEditing && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 999,
                    }}
                >
                    <EditProfile initialData={profileData} onCancel={() => setIsEditing(false)} onSave={handleSave}/>
                </div>
            )}
        </div>
    );
};

export default CreateProfilePage;
