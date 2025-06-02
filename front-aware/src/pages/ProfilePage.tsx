import React, {useEffect, useState} from 'react';
import {FaEdit} from 'react-icons/fa';
import ProfileInfo from '../components/ProfilePage/ProfileInfo';
import Settings from '../components/ProfilePage/Settings';
import EditProfile, {type ProfileData} from '../components/ProfilePage/EditProfile';


interface ProfileDTO {
    favoriteTopics: string[];
    language: string;
    country: string;
    dateJoined: string;   // e.g. "March 2024"
    name: string;
    email: string;
    bio: string;
    bannerPhoto: string;
    profilePhoto: string;
}

const ProfilePage: React.FC = () => {
    const [profileData, setProfileData] = useState<ProfileDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        async function fetchProfile() {
            const token = localStorage.getItem('authToken') || '';
            if (!token) {
                setError('No auth token found. Are you logged in?');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                console.log('[ProfilePage] → Fetching from http://localhost:3001/users/me …');
                const res = await fetch('http://localhost:3001/users/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log('[ProfilePage] ← status:', res.status);

                if (!res.ok) {
                    throw new Error(`Failed to load profile (status ${res.status})`);
                }

                const data = await res.json();
                console.log('[ProfilePage] ← JSON:', data);

                const createdAtIso = data.createdAt || data.dateJoined;
                const dateObj = new Date(createdAtIso);
                const formattedDate = dateObj.toLocaleDateString(undefined, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                });

                setProfileData({
                    favoriteTopics: data.favoriteTopics || [],
                    language: data.language || '',
                    country: data.country || '',
                    dateJoined: formattedDate,
                    name: data.name || '',
                    email: data.email,
                    bio: data.bio || '',
                    bannerPhoto: data.bannerPhoto || '/news1.jpg',
                    profilePhoto: data.profilePhoto || '/news2.jpg',
                });
            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.error('[ProfilePage] Fetch error:', err.message);
                    setError(err.message);
                } else {
                    console.error('[ProfilePage] Unknown fetch error:', err);
                    setError(String(err));
                }
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, []);

    const handleSave = async (updated: Omit<ProfileData, 'email' | 'dateJoined'>) => {
        const token = localStorage.getItem('authToken') || '';
        if (!token) {
            setError('No auth token found. Cannot save.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('[ProfilePage] → PUT to http://localhost:3001/users/profile with:', updated);

            const res = await fetch('http://localhost:3001/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: updated.name,
                    bio: updated.bio,
                    language: updated.language,
                    country: updated.country,
                    favoriteTopics: updated.favoriteTopics,
                    profilePhoto: updated.profilePhoto,
                    bannerPhoto: updated.bannerPhoto,
                }),
            });

            console.log('[ProfilePage] ← PUT status:', res.status);

            if (!res.ok) {
                throw new Error(`Failed to update profile (status ${res.status})`);
            }

            const data = await res.json();
            console.log('[ProfilePage] ← PUT JSON:', data);

            const dateObj = new Date(data.createdAt);
            const formattedDate = dateObj.toLocaleDateString(undefined, {
                month: 'long',
                year: 'numeric',
            });

            setProfileData({
                favoriteTopics: data.favoriteTopics || [],
                language: data.language || '',
                country: data.country || '',
                dateJoined: formattedDate,
                name: data.name || '',
                email: data.email,
                bio: data.bio || '',
                bannerPhoto: data.bannerPhoto || '/news1.jpg',
                profilePhoto: data.profilePhoto || '/news2.jpg',
            });

            setIsEditing(false);
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error('[ProfilePage] PUT error:', err.message);
                setError(err.message);
            } else {
                console.error('[ProfilePage] Unknown PUT error:', err);
                setError(String(err));
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{padding: '20px'}}>Loading profile...</div>;
    }

    if (error) {
        return <div style={{padding: '20px', color: 'red'}}>Error: {error}</div>;
    }

    if (!profileData) {
        return <div style={{padding: '20px'}}>No profile data found.</div>;
    }

    return (
        <div style={{display: 'flex', padding: '10px', position: 'relative'}}>
            <div style={{flex: 4}}>
                <ProfileInfo
                    favoriteTopics={profileData.favoriteTopics}
                    language={profileData.language}
                    country={profileData.country}
                    dateJoined={profileData.dateJoined}
                    name={profileData.name}
                    email={profileData.email}
                    bio={profileData.bio}
                    bannerPhoto={profileData.bannerPhoto}
                    profilePhoto={profileData.profilePhoto}
                />

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
                            fontSize: '14px',
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
