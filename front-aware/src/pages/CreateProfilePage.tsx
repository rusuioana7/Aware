import EditProfile from "../components/ProfilePage/EditProfile.tsx";
import React, {useState} from "react";

const CreateProfilePage: React.FC = () => {
    const [profileData, setProfileData] = useState({
        favoriteTopics: ['Lifestyle', 'Sport', 'Politics'],
        language: 'English',
        country: 'Romania',
        dateJoined: 'March 2024',
        name: 'Mirela Mirelascu',
        email: 'mirelamirelascu@gmail.com',
        bio: 'Passionate front-end developer, design enthusiast.',
    });

    const [isEditing, setIsEditing] = useState(true);

    const handleSave = (data: typeof profileData) => {
        setProfileData(data);
        setIsEditing(false);
    };

    return (
        <div className="flex h-screen w-full" style={{backgroundColor: '#031A6B'}}>
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

export default CreateProfilePage;
