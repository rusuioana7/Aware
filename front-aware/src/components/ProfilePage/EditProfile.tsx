import React, { useEffect, useRef, useState } from 'react';
import TopicTag from '../Cards/Tags/TopicTag';
import { TOPIC_COLORS } from '../Cards/Tags/TagColor';

export interface ProfileData {
    favoriteTopics: string[];
    language: string[];
    country: string[];
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

const labelStyle: React.CSSProperties = {
    fontWeight: 'bold',
    color: '#031A6B',
    minWidth: '90px',
    fontSize: '18px',
};

const allTopics = Object.keys(TOPIC_COLORS)
    .filter(key => key !== 'general' && key !== 'all')
    .map(key => key.charAt(0).toUpperCase() + key.slice(1));

const allLanguages = ['Romanian', 'English', 'French', 'Spanish', 'German'];

const allCountries = [
    'Albania','Andorra','Armenia','Austria','Azerbaijan',
    'Belarus','Belgium','Bosnia and Herzegovina','Bulgaria',
    'Croatia','Cyprus','Czech Republic','Denmark','Estonia',
    'Finland','France','Georgia','Germany','Greece','Hungary',
    'Iceland','Ireland','Italy','Kazakhstan','Kosovo','Latvia',
    'Liechtenstein','Lithuania','Luxembourg','Malta','Moldova',
    'Monaco','Montenegro','Netherlands','North Macedonia','Norway',
    'Poland','Portugal','Romania','Russia','San Marino','Serbia',
    'Slovakia','Slovenia','Spain','Sweden','Switzerland','Turkey',
    'Ukraine','United Kingdom','Vatican City'
];

const EditProfile: React.FC<EditProfileProps> = ({
                                                     initialData,
                                                     onCancel,
                                                     onSave,
                                                 }) => {
    const [formData, setFormData] = useState<ProfileData>(initialData);

    const [selectedTopics, setSelectedTopics] = useState<string[]>(
        initialData.favoriteTopics || []
    );
    const [topicsDropdownOpen, setTopicsDropdownOpen] = useState(false);
    const topicsDropdownRef = useRef<HTMLDivElement>(null);

    const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
        initialData.language || []
    );
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const langDropdownRef = useRef<HTMLDivElement>(null);

    const [selectedCountries, setSelectedCountries] = useState<string[]>(
        initialData.country || []
    );
    const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
    const countryDropdownRef = useRef<HTMLDivElement>(null);

    const fileInputAvatarRef = useRef<HTMLInputElement>(null);
    const fileInputCoverRef = useRef<HTMLInputElement>(null);
    const [isBannerHover, setIsBannerHover] = useState(false);
    const [isProfileHover, setIsProfileHover] = useState(false);

    useEffect(() => {
        function handler(event: MouseEvent) {
            if (
                topicsDropdownRef.current &&
                !topicsDropdownRef.current.contains(event.target as Node)
            ) {
                setTopicsDropdownOpen(false);
            }
            if (
                langDropdownRef.current &&
                !langDropdownRef.current.contains(event.target as Node)
            ) {
                setLangDropdownOpen(false);
            }
            if (
                countryDropdownRef.current &&
                !countryDropdownRef.current.contains(event.target as Node)
            ) {
                setCountryDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleChange = (field: keyof ProfileData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
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
            const { url } = await uploadRes.json();
            setFormData(prev => ({ ...prev, [field]: url }));
        } catch (err: unknown) {
            console.error('Upload error:', err);
            if (err instanceof Error) {
                alert(`Upload failed: ${err.message}`);
            } else {
                alert('Unknown upload error');
            }
        }
    };

    const toggleTopic = (topic: string) => {
        setSelectedTopics(prev => {
            const updated = prev.includes(topic)
                ? prev.filter(t => t !== topic)
                : [...prev, topic];
            return updated.sort(
                (a, b) => allTopics.indexOf(a) - allTopics.indexOf(b)
            );
        });
    };

    const toggleLanguage = (lang: string) => {
        setSelectedLanguages(prev => {
            const updated = prev.includes(lang)
                ? prev.filter(l => l !== lang)
                : [...prev, lang];
            return updated.sort(
                (a, b) => allLanguages.indexOf(a) - allLanguages.indexOf(b)
            );
        });
    };

    const toggleCountry = (ctr: string) => {
        setSelectedCountries(prev => {
            const updated = prev.includes(ctr)
                ? prev.filter(c => c !== ctr)
                : [...prev, ctr];
            return updated.sort(
                (a, b) => allCountries.indexOf(a) - allCountries.indexOf(b)
            );
        });
    };

    return (
        <div
            style={{
                width: '600px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
                /* Allow dropdown panels to overflow */
                overflow: 'visible',
                position: 'relative',
                maxHeight: '90vh',
            }}
        >
            {/* banner */}
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
                            zIndex: 2,
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
                    style={{ display: 'none' }}
                    onChange={e =>
                        handleFileChange('bannerPhoto', e.target.files?.[0] || null)
                    }
                />
            </div>

            {/* profile */}
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
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                            zIndex: 2,
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
                    style={{ display: 'none' }}
                    onChange={e =>
                        handleFileChange('profilePhoto', e.target.files?.[0] || null)
                    }
                />
            </div>

            {/* Name + Email */}
            <div style={{ marginTop: '5px', marginLeft: '140px', padding: '10px 20px 0 20px' }}>
                <label style={{ ...labelStyle, display: 'block' }}>Name:</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={e => handleChange('name', e.target.value)}
                    style={inputStyle}
                    placeholder="Name"
                />

                <label style={{ ...labelStyle, display: 'block' }}>Email:</label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={e => handleChange('email', e.target.value)}
                    style={inputStyle}
                    placeholder="Email"
                    disabled
                />
            </div>

            {/* Bio */}
            <div style={{ marginLeft: '140px', padding: '0 20px' }}>
                <label style={{ ...labelStyle, display: 'block' }}>Bio:</label>
                <textarea
                    value={formData.bio}
                    onChange={e => handleChange('bio', e.target.value)}
                    style={{ ...inputStyle, height: '100px', resize: 'vertical' }}
                    placeholder="Bio"
                />
            </div>

            <hr style={{ margin: '20px 10px', borderTop: '1px solid #ddd' }} />

            {/* Favorite Topics  */}
            <div style={{ padding: '0px 30px' }}>
                <div style={{ position: 'relative' }} ref={topicsDropdownRef}>
                    <label
                        style={{
                            ...labelStyle,
                            display: 'block',
                            marginBottom: 6,
                            cursor: 'pointer',
                        }}
                        onClick={() => setTopicsDropdownOpen(open => !open)}
                    >
                        Topics:
                        <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                            {selectedTopics.length === 0 ? (
                                <span style={{ color: '#888', fontStyle: 'italic' }}>Select...</span>
                            ) : (
                                selectedTopics.map(topic => (
                                    <TopicTag key={topic} label={topic} selected={true} />
                                ))
                            )}
                        </div>
                    </label>

                    {topicsDropdownOpen && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                backgroundColor: 'white',
                                border: '1px solid #CCC',
                                borderRadius: 8,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                padding: 8,
                                zIndex: 10,
                                minWidth: 200,
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
                                        <span style={{ color: '#031A6B' }}>{topic}</span>
                                        {isSelected && <span style={{ fontWeight: 'bold' }}>✓</span>}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Language */}
            <div style={{ padding: '0px 30px', marginTop: '10px' }}>
                <div style={{ position: 'relative' }} ref={langDropdownRef}>
                    <label
                        style={{
                            ...labelStyle,
                            display: 'block',
                            marginBottom: 6,
                            cursor: 'pointer',
                        }}
                        onClick={() => setLangDropdownOpen(open => !open)}
                    >
                        Languages:
                        <div style={{ display: 'inline-flex', gap: 6, marginTop: 6 }}>
                            {selectedLanguages.length === 0 ? (
                                <span style={{ color: '#888', fontStyle: 'italic' }}>Select...</span>
                            ) : (
                                <span style={{ color: '#031A6B' }}>
                  {selectedLanguages.join(', ')}
                </span>
                            )}
                        </div>
                    </label>

                    {langDropdownOpen && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                backgroundColor: 'white',
                                border: '1px solid #CCC',
                                borderRadius: 8,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                padding: 8,
                                zIndex: 10,
                                minWidth: 200,
                                maxHeight: 180,
                                overflowY: 'auto',
                            }}
                        >
                            {allLanguages.map(lang => {
                                const isSelected = selectedLanguages.includes(lang);
                                return (
                                    <div
                                        key={lang}
                                        onClick={() => toggleLanguage(lang)}
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
                                        <span style={{ color: '#031A6B' }}>{lang}</span>
                                        {isSelected && <span style={{ fontWeight: 'bold' }}>✓</span>}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Country */}
            <div style={{ padding: '0px 30px', marginTop: '10px' }}>
                <div style={{ position: 'relative' }} ref={countryDropdownRef}>
                    <label
                        style={{
                            ...labelStyle,
                            display: 'block',
                            marginBottom: 6,
                            cursor: 'pointer',
                        }}
                        onClick={() => setCountryDropdownOpen(open => !open)}
                    >
                        Countries:
                        <div style={{ display: 'inline-flex', gap: 6, marginTop: 6 }}>
                            {selectedCountries.length === 0 ? (
                                <span style={{ color: '#888', fontStyle: 'italic' }}>Select...</span>
                            ) : (
                                <span style={{ color: '#031A6B' }}>
                  {selectedCountries.join(', ')}
                </span>
                            )}
                        </div>
                    </label>

                    {countryDropdownOpen && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                backgroundColor: 'white',
                                border: '1px solid #CCC',
                                borderRadius: 8,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                padding: 8,
                                zIndex: 10,
                                minWidth: 240,
                                maxHeight: 150,
                                overflowY: 'auto',
                            }}
                        >
                            {allCountries.map(ctr => {
                                const isSelected = selectedCountries.includes(ctr);
                                return (
                                    <div
                                        key={ctr}
                                        onClick={() => toggleCountry(ctr)}
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
                                        <span style={{ color: '#031A6B' }}>{ctr}</span>
                                        {isSelected && <span style={{ fontWeight: 'bold' }}>✓</span>}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Cancel / Save Buttons */}
            <div style={{ padding: '0 30px', marginTop: '20px' }}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '10px',
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
                                language: selectedLanguages, // array
                                country: selectedCountries,  // array
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
