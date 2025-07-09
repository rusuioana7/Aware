import React, {useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import EditProfile, {type ProfileData} from '../components/ProfilePage/EditProfile';

const CreateProfilePage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [isEditing, setIsEditing] = useState(true);

    useEffect(() => {
        console.log('[CreateProfilePage] location.search =', location.search);

        const params = new URLSearchParams(location.search);
        const queryEmail = params.get('email');
        const token = params.get('accessToken');

        if (token) {
            console.log('[CreateProfilePage] Found accessToken in URL:', token);
            localStorage.setItem('authToken', token);
            params.delete('accessToken');
            const newSearch = params.toString();
            const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '');
            window.history.replaceState({}, '', newUrl);
        }

        if (queryEmail) {
            console.log('[CreateProfilePage] Found email in URL:', queryEmail);
            const emptyProfile: ProfileData = {
                email: queryEmail,
                name: '',
                bio: '',
                favoriteTopics: [],
                language: [],
                country: [],
                profilePhoto: '',
                bannerPhoto: '',
                dateJoined: new Date().toISOString(),
            };
            setProfileData(emptyProfile);
            return;
        }


        console.log('[CreateProfilePage] No accessToken or email in URL → fetching /users/me');
        (async () => {
            try {
                const res = await fetch('http://localhost:3001/users/me', {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'},
                    credentials: 'include',
                });

                console.log('[CreateProfilePage] GET /users/me status =', res.status);
                if (res.status === 401 || res.status === 404) {
                    console.error('[CreateProfilePage] /users/me returned 401/404, redirecting to /login');
                    navigate('/login');
                    return;
                }
                if (!res.ok) {
                    throw new Error(`Failed to load user (${res.status})`);
                }

                const data = await res.json();
                console.log('[CreateProfilePage] GET /users/me JSON =', data);

                const emptyProfile: ProfileData = {
                    email: data.email || '',
                    name: '',
                    bio: '',
                    favoriteTopics: [],
                    language: [],
                    country: [],
                    profilePhoto: '',
                    bannerPhoto: '',
                    dateJoined: data.createdAt || new Date().toISOString(),
                };
                setProfileData(emptyProfile);
            } catch (err) {
                console.error('[CreateProfilePage] Error in fetch /users/me:', err);
                navigate('/login');
            }
        })();
    }, [location, navigate]);

    if (!profileData) {
        return (
            <div style={{color: 'white', textAlign: 'center', marginTop: '2rem'}}>
                Loading profile...
            </div>
        );
    }

    const handleSave = async (updatedData: ProfileData) => {
        try {
            console.log('[CreateProfilePage] Saving profile with data:', updatedData);
            const {name, bio, favoriteTopics, language, country, profilePhoto, bannerPhoto} = updatedData;
            const payload = {name, bio, favoriteTopics, language, country, profilePhoto, bannerPhoto};

            const res = await fetch('http://localhost:3001/users/profile', {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            console.log('[CreateProfilePage] PUT /users/profile status =', res.status);
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to save profile: ${errorText}`);
            }

            console.log('[CreateProfilePage] Profile saved successfully');
            setIsEditing(false);
            navigate('/home');
        } catch (err) {
            console.error('[CreateProfilePage] Error saving profile:', err);
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

export default CreateProfilePage;
