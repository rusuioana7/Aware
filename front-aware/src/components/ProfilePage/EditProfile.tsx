import React, {useEffect, useRef, useState} from 'react';
import TopicTag from '../Cards/Tags/TopicTag';
import {TOPIC_COLORS} from '../Cards/Tags/TagColor';

export interface ProfileData {
    favoriteTopics: string[];
    language: string;
    country: string;
    name: string;
    email: string;
    bio: string;
    dateJoined: string;
    profilePhoto: string;
    bannerPhoto: string;
}

export interface EditProfileProps {
    initialData: ProfileData;
    onCancel: () => void;
    onSave: (data: ProfileData) => void;
}

const inputStyle: React.CSSProperties = {
    width: '70%',
    padding: '10px',
    fontSize: '16px',
    marginBottom: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    backgroundColor: '#f5f5f5',
    outline: 'none',
};

const selectStyle: React.CSSProperties = {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    backgroundColor: '#f5f5f5',
    width: '70%',
};

const labelStyle: React.CSSProperties = {
    fontWeight: 'bold',
    color: '#031A6B',
    minWidth: '90px',
    fontSize: '18px',
};

const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
    gap: '10px',
};

const allTopics = Object.keys(TOPIC_COLORS)
    .filter(key => key !== 'general' && key !== 'all')
    .map(key => key.charAt(0).toUpperCase() + key.slice(1));

const EditProfile: React.FC<EditProfileProps> = ({initialData, onCancel, onSave}) => {
    const [formData, setFormData] = useState<ProfileData>(initialData);
    const [selectedTopics, setSelectedTopics] = useState<string[]>(initialData.favoriteTopics || []);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fileInputAvatarRef = useRef<HTMLInputElement>(null);
    const fileInputCoverRef = useRef<HTMLInputElement>(null);

    const [isBannerHover, setIsBannerHover] = useState(false);
    const [isProfileHover, setIsProfileHover] = useState(false);

    useEffect(() => {
        function handler(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleChange = (field: keyof ProfileData, value: string) => {
        setFormData(prev => ({...prev, [field]: value}));
    };


    const handleFileChange = async (
        field: 'profilePhoto' | 'bannerPhoto',
        file: File | null
    ) => {
        if (!file) return;
        try {
            const form = new FormData();
            form.append('image', file);

            const uploadRes = await fetch('http://localhost:3001/upload', {
                method: 'POST',
                body: form,
            });
            if (!uploadRes.ok) {
                const errorJson = await uploadRes.json();
                throw new Error(errorJson.message || 'Upload failed');
            }
            const {url} = await uploadRes.json();
            setFormData(prev => ({...prev, [field]: url}));
        } catch (err: unknown) {
            console.error('File upload error:', err);
            if (err instanceof Error) {
                alert(`Upload error: ${err.message}`);
            } else {
                alert('Unknown upload error');
            }
        }
    };

    const toggleTopic = (topic: string) => {
        setSelectedTopics(prev => {
            const updated = prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic];
            return updated.sort((a, b) => allTopics.indexOf(a) - allTopics.indexOf(b));
        });
    };

    return (
        <div
            style={{
                width: '600px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
                overflow: 'hidden',
                position: 'relative',
                maxHeight: '700px',
                overflowY: 'auto',
            }}
        >
            {/* banner photo */}
            <div
                style={{
                    height: '120px',
                    backgroundImage: `url(${formData.bannerPhoto})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    cursor: 'pointer',
                }}
                onMouseEnter={() => setIsBannerHover(true)}
                onMouseLeave={() => setIsBannerHover(false)}
                onClick={() => fileInputCoverRef.current?.click()}
            >
                {isBannerHover && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1,
                            fontWeight: 'bold',
                            fontSize: 16,
                        }}
                    >
                        Upload Cover
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputCoverRef}
                    style={{display: 'none'}}
                    onChange={e => handleFileChange('bannerPhoto', e.target.files?.[0] || null)}
                />
            </div>

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
                    cursor: 'pointer',
                }}
                onMouseEnter={() => setIsProfileHover(true)}
                onMouseLeave={() => setIsProfileHover(false)}
                onClick={() => fileInputAvatarRef.current?.click()}
            >
                <img
                    src={formData.profilePhoto}
                    alt="Avatar"
                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                />
                {isProfileHover && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1,
                            fontWeight: 'bold',
                            fontSize: 14,
                            borderRadius: '50%',
                        }}
                    >
                        Upload Avatar
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputAvatarRef}
                    style={{display: 'none'}}
                    onChange={e => handleFileChange('profilePhoto', e.target.files?.[0] || null)}
                />
            </div>

            {/* name and email */}
            <div style={{marginTop: '5px', marginLeft: '140px', padding: '10px 20px 0 20px'}}>
                <label style={{...labelStyle, display: 'block'}}>Name:</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={e => handleChange('name', e.target.value)}
                    style={inputStyle}
                    placeholder="Name"
                />

                <label style={{...labelStyle, display: 'block'}}>Email:</label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={e => handleChange('email', e.target.value)}
                    style={inputStyle}
                    placeholder="Email"
                    disabled
                />
            </div>

            {/* bio */}
            <div style={{marginLeft: '140px', padding: '0 20px'}}>
                <label style={{...labelStyle, display: 'block'}}>Bio:</label>
                <textarea
                    value={formData.bio}
                    onChange={e => handleChange('bio', e.target.value)}
                    style={{...inputStyle, height: '100px', resize: 'vertical'}}
                    placeholder="Bio"
                />
            </div>

            <hr style={{margin: '20px 10px', borderTop: '1px solid #ddd'}}/>

            {/* favorite topics */}
            <div style={{padding: '0px 30px'}}>
                <div style={{position: 'relative'}} ref={dropdownRef}>
                    <label
                        style={{
                            ...labelStyle,
                            display: 'block',
                            marginBottom: 6,
                            cursor: 'pointer',
                        }}
                        onClick={() => setDropdownOpen(open => !open)}
                    >
                        Topics:
                        <div style={{display: 'inline-flex', flexWrap: 'wrap', gap: 6, marginTop: 6}}>
                            {selectedTopics.length === 0 ? (
                                <span style={{color: '#888', fontStyle: 'italic'}}>Select...</span>
                            ) : (
                                selectedTopics.map(topic => (
                                    <TopicTag key={topic} label={topic} selected={true}/>
                                ))
                            )}
                        </div>
                    </label>

                    {dropdownOpen && (
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 300,
                                backgroundColor: 'white',
                                border: '1px solid #CCC',
                                borderRadius: 8,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                padding: 8,
                                zIndex: 10,
                                minWidth: 180,
                                maxHeight: 180,
                                overflowY: 'auto',
                            }}
                        >
                            {allTopics.map(topic => {
                                const isSelected = selectedTopics.includes(topic);
                                return (
                                    <div
                                        key={topic}
                                        onClick={() => toggleTopic(topic)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            padding: '6px 10px',
                                            borderRadius: 6,
                                            cursor: 'pointer',
                                            backgroundColor: isSelected ? '#e0e7ff' : 'transparent',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <TopicTag label={topic} selected={isSelected}/>
                                        {isSelected && <span style={{color: '#031A6B', fontWeight: 'bold'}}>✓</span>}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* language and country */}
            <div style={{padding: '0 30px', marginTop: '10px'}}>
                <div style={rowStyle}>
                    <label style={labelStyle}>Language:</label>
                    <select
                        value={formData.language}
                        onChange={e => handleChange('language', e.target.value)}
                        style={selectStyle}
                    >
                        <option value="">Select...</option>
                        <option value="English">English</option>
                        <option value="Romanian">Romanian</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                    </select>
                </div>

                <div style={rowStyle}>
                    <label style={labelStyle}>Country:</label>
                    <select
                        value={formData.country}
                        onChange={e => handleChange('country', e.target.value)}
                        style={selectStyle}
                    >
                        <option value="">Select...</option>
                        <option value="Romania">Romania</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                        <option value="Germany">Germany</option>
                    </select>
                </div>

                {/* buttons */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '10px',
                        marginTop: '20px',
                        marginBottom: '20px',
                    }}
                >
                    <button
                        onClick={onCancel}
                        style={{
                            backgroundColor: 'white',
                            color: '#031A6B',
                            borderRadius: '8px',
                            border: '1px solid #031A6B',
                            padding: '8px 20px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() =>
                            onSave({
                                ...formData,
                                favoriteTopics: selectedTopics,
                            })
                        }
                        style={{
                            backgroundColor: '#031A6B',
                            color: 'white',
                            borderRadius: '8px',
                            border: 'none',
                            padding: '8px 20px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
