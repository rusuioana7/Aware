import React from 'react';
import TopicTag from '../Cards/Tags/TopicTag';

interface ProfileInfoProps {
    favoriteTopics: string[],
    language: string[],
    country: string[],
    dateJoined: string,
    name: string,
    email: string,
    bio: string,
    bannerPhoto?: string,
    profilePhoto?: string,
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
                                                     favoriteTopics,
                                                     language,
                                                     country,
                                                     dateJoined,
                                                     name,
                                                     email,
                                                     bio,
                                                     bannerPhoto = '',
                                                     profilePhoto = '/default.png',
                                                 }) => {
    const commaSeparated = (items: string[]) =>
        items.length > 0 ? items.join(', ') : '—';

    return (
        <div
            style={{
                flex: 3,
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                paddingBottom: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                marginRight: '20px',
                marginTop: '20px',
                position: 'relative',
                overflow: 'hidden',
                height: 'fit-content',

            }}
        >
            {/* banner photo */}
            <div
                style={{
                    height: '120px',
                    backgroundImage: `url('${bannerPhoto}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            ></div>

            {/* profile photo */}
            <div
                style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '4px solid white',
                    position: 'absolute',
                    top: '90px',
                    left: '20px',
                    backgroundColor: '#ccc',
                }}
            >
                <img
                    src={profilePhoto}
                    alt="Profile"
                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                />
            </div>

            {/* name and email */}
            <div style={{marginTop: '5px', marginLeft: '140px', padding: '10px'}}>
                <h2 style={{margin: 0, color: '#031A6B'}}>{name}</h2>
                <p style={{marginTop: '5px', color: '#031A6B'}}>{email}</p>
            </div>

            {/* bio */}
            <div style={{marginTop: '5px', marginLeft: '20px', padding: '10px'}}>
                <p
                    style={{
                        marginTop: '-15px',
                        fontSize: '17px',
                        color: '#666',
                        lineHeight: 1.4,
                        maxWidth: '97%',
                        textAlign: 'center',
                    }}
                >
                    {bio}
                </p>
            </div>

            <hr
                style={{
                    margin: '0 10px',
                    border: 'none',
                    borderTop: '1px solid #ddd',
                }}
            />

            <div style={{padding: '0 30px', marginTop: '20px'}}>
                {/* favorite topics */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '10px',
                        marginBottom: '12px',
                    }}
                >
          <span
              style={{color: '#031A6B', fontSize: '18px', fontWeight: 600}}
          >
            Favorite Topics:
          </span>
                    {favoriteTopics.map(topic => (
                        <TopicTag key={topic} label={topic}/>
                    ))}
                </div>

                {/* language */}
                <p style={{margin: '10px 0', color: '#031A6B', fontSize: '18px'}}>
                    <strong>Language:</strong> {commaSeparated(language)}
                </p>

                {/* country */}
                <p style={{margin: '10px 0', color: '#031A6B', fontSize: '18px'}}>
                    <strong>Country:</strong> {commaSeparated(country)}
                </p>

                {/* date joined */}
                <p style={{margin: '10px 0', color: '#031A6B', fontSize: '18px'}}>
                    <strong>Date Joined:</strong> {dateJoined}
                </p>
            </div>
        </div>
    );
};

export default ProfileInfo;
