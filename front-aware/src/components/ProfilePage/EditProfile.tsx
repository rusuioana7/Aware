import React, {useEffect, useRef, useState} from 'react';
import TopicTag from '../Cards/Tags/TopicTag';
import {TOPIC_COLORS} from "../Cards/Tags/TagColor.tsx";

interface EditProfileProps {
    initialData: {
        favoriteTopics: string[];
        language: string;
        country: string;
        name: string;
        email: string;
        bio: string;
        dateJoined: string;
    };
    onCancel: () => void;
    onSave: (data: EditProfileProps['initialData']) => void;
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
    const [formData, setFormData] = useState(initialData);
    const [selectedTopics, setSelectedTopics] = useState<string[]>(() => {
        const init = initialData.favoriteTopics || [];
        return init.slice().sort((a, b) => allTopics.indexOf(a) - allTopics.indexOf(b));
    });
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);


    const [isBannerHover, setIsBannerHover] = useState(false);
    const [isProfileHover, setIsProfileHover] = useState(false);


    const toggleTopic = (topic: string) => {
        setSelectedTopics(prev => {
            let newTopics: string[];
            if (prev.includes(topic)) {
                newTopics = prev.filter(t => t !== topic);
            } else {
                newTopics = [...prev, topic];
            }
            return newTopics.slice().sort((a, b) => allTopics.indexOf(a) - allTopics.indexOf(b));
        });
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData({...formData, [field]: value});
    };

    return (
        <div style={{
            width: '600px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
            overflow: 'hidden',
            position: 'relative',
            maxHeight: '700px',
            overflowY: 'auto',
        }}>
            <div
                style={{
                    height: '120px',
                    backgroundImage: `url('./news1.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    cursor: 'pointer',
                }}
                onMouseEnter={() => setIsBannerHover(true)}
                onMouseLeave={() => setIsBannerHover(false)}
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
                        Edit Banner
                    </div>
                )}
            </div>

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
            >
                <img
                    src={'/news2.jpg'}
                    alt="Profile"
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
                        Edit Photo
                    </div>
                )}
            </div>


            <div style={{marginTop: '5px', marginLeft: '140px', padding: '10px 20px 0 20px'}}>
                <label style={{...labelStyle, display: 'block'}}>Name:</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    style={inputStyle}
                    placeholder="Name"
                />

                <label style={{...labelStyle, display: 'block'}}>Email:</label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    style={inputStyle}
                    placeholder="Email"
                />
            </div>

            <div style={{marginLeft: '140px', padding: '0 20px'}}>
                <label style={{...labelStyle, display: 'block'}}>Bio:</label>
                <textarea
                    value={formData.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    style={{...inputStyle, height: '100px', resize: 'vertical'}}
                    placeholder="Bio"
                />
            </div>

            <hr style={{margin: '20px 10px', borderTop: '1px solid #ddd'}}/>

            <div style={{padding: '0px 30px'}}>
                <div style={{position: 'relative'}} ref={dropdownRef}>
                    <label
                        style={{
                            fontWeight: 'bold',
                            color: '#031A6B',
                            minWidth: '90px',
                            fontSize: '18px',
                            display: 'block',
                            marginBottom: 6,
                            cursor: 'pointer',
                            minHeight: 32,
                            marginRight: '20px'
                        }}
                        onClick={() => setDropdownOpen(open => !open)}
                        aria-haspopup="listbox"
                        aria-expanded={dropdownOpen}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') setDropdownOpen(open => !open);
                        }}
                    >
                        Topics:
                        <div style={{display: 'inline-flex', flexWrap: 'wrap', gap: 6, marginTop: 6}}>
                            {selectedTopics.length === 0 ? (
                                <span style={{color: '#888', fontStyle: 'italic'}}>Select...</span>
                            ) : (
                                selectedTopics.map(topic => (
                                    <TopicTag key={topic} label={topic} selected={true} style={{userSelect: 'none'}}/>
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
                                userSelect: 'none',
                            }}
                            role="listbox"
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
                                            transition: 'background-color 0.2s ease',
                                            justifyContent: 'space-between',
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.backgroundColor = '#f0f0f0';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.backgroundColor = isSelected ? '#e0e7ff' : 'transparent';
                                        }}
                                        role="option"
                                        aria-selected={isSelected}
                                        tabIndex={0}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                toggleTopic(topic);
                                            }
                                        }}
                                    >
                                        <TopicTag label={topic} selected={isSelected}
                                                  style={{cursor: 'default', userSelect: 'none'}}/>
                                        {isSelected && (
                                            <span style={{color: '#031A6B', fontWeight: 'bold', fontSize: 18}}>✓</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div style={{padding: '0 30px', marginTop: '10px'}}>
                <div style={rowStyle}>
                    <label style={labelStyle}>Language:</label>
                    <select
                        value={formData.language}
                        onChange={(e) => handleChange('language', e.target.value)}
                        style={selectStyle}
                    >
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
                        onChange={(e) => handleChange('country', e.target.value)}
                        style={selectStyle}
                    >
                        <option value="Romania">Romania</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                        <option value="Germany">Germany</option>
                    </select>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '10px',
                    marginTop: '20px',
                    marginBottom: '20px',
                }}>
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
                        onClick={() => {
                            onSave({
                                ...formData,
                                favoriteTopics: selectedTopics,
                            });
                        }}
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