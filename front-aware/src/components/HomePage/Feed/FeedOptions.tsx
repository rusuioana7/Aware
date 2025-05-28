import React, {useState, useRef, useEffect} from 'react';
import TopicTag from '../../Cards/Tags/TopicTag.tsx';
import {TOPIC_COLORS} from '../../Cards/Tags/TagColor.tsx';
import SortSelector from '../../Cards/SelectMenu/SelectSort.tsx';
import ViewSelector from '../../Cards/SelectMenu/SelectView.tsx';

type FeedOptionsProps = {
    onViewChange: (view: 'All' | 'Articles' | 'Threads') => void;
};

const sortOptions: Array<'Newest' | 'Popular' | 'Verified Only'> = ['Newest', 'Popular', 'Verified Only'];
const viewOptions: Array<'All' | 'Articles' | 'Threads'> = ['All', 'Articles', 'Threads'];

const FeedOptions: React.FC<FeedOptionsProps> = ({onViewChange}) => {
    const allTopics = Object.keys(TOPIC_COLORS)
        .filter((key) => key !== 'general')
        .map((key) => key.charAt(0).toUpperCase() + key.slice(1));

    const [selectedSort, setSelectedSort] = useState<'Newest' | 'Popular' | 'Verified Only'>('Newest');
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [selectedView, setSelectedView] = useState<'All' | 'Articles' | 'Threads'>('All');

    const handleViewChange = (option: 'All' | 'Articles' | 'Threads') => {
        const newView = selectedView === option ? 'All' : option;
        setSelectedView(newView);
        onViewChange(newView);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleTopic = (topic: string) => {
        setSelectedTopics((prev) =>
            prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
        );
    };

    const sortedSelectedTopics = selectedTopics.slice().sort((a, b) => {
        return allTopics.indexOf(a) - allTopics.indexOf(b);
    });

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    marginBottom: 7,
                    marginTop: 15,
                    paddingLeft: 5,
                    paddingRight: 5,
                }}
            >
                <h2 style={{fontSize: 22, fontWeight: 'bold', color: '#000', margin: 0, flexShrink: 0}}>
                    Feed
                </h2>

                <div
                    style={{
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        flexWrap: 'wrap',
                        position: 'relative',
                    }}
                    ref={dropdownRef}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 8,
                            justifyContent: 'center',
                            flexGrow: 1,
                        }}
                    >
                        {sortedSelectedTopics.map((topic) => (
                            <TopicTag key={topic} label={topic} onClick={() => toggleTopic(topic)} selected={true}/>
                        ))}
                    </div>

                    <button
                        onClick={() => setDropdownOpen((open) => !open)}
                        style={{
                            border: '1px solid #031A6B',
                            backgroundColor: 'transparent',
                            color: '#031A6B',
                            borderRadius: '50%',
                            width: 28,
                            height: 28,
                            fontSize: 20,
                            lineHeight: '26px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 0,
                            userSelect: 'none',
                            transition: 'background-color 0.2s ease',
                            flexShrink: 0,
                            marginLeft: 12,
                        }}
                        aria-label="Add topic"
                        title="Add topic"
                    >
                        +
                    </button>

                    {dropdownOpen && (
                        <div
                            style={{
                                position: 'absolute',
                                top: 36,
                                right: 0,
                                backgroundColor: 'white',
                                border: '1px solid #CCC',
                                borderRadius: 8,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                padding: 8,
                                zIndex: 10,
                                minWidth: 180,
                                maxHeight: 240,
                                overflowY: 'auto',
                                userSelect: 'none',
                            }}
                        >
                            {allTopics.map((topic) => {
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
                                        onMouseEnter={(e) => {
                                            (e.currentTarget as HTMLDivElement).style.backgroundColor = '#f0f0f0';
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.currentTarget as HTMLDivElement).style.backgroundColor = isSelected
                                                ? '#e0e7ff'
                                                : 'transparent';
                                        }}
                                    >
                                        <TopicTag
                                            label={topic}
                                            selected={isSelected}
                                            style={{cursor: 'default', userSelect: 'none'}}
                                        />
                                        {isSelected && (
                                            <span
                                                style={{
                                                    color: '#031A6B',
                                                    fontWeight: 'bold',
                                                    fontSize: 18,
                                                    userSelect: 'none',
                                                }}
                                                aria-label="Selected"
                                                title="Selected"
                                            >
                        ✓
                      </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div style={{flex: 1, height: 1, backgroundColor: '#CCC', marginBottom: 16}}/>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 60,
                    flexWrap: 'wrap',
                    marginBottom: 10,
                }}
            >
                <SortSelector options={sortOptions} selected={selectedSort} onSelect={setSelectedSort}/>
                <ViewSelector options={viewOptions} selected={selectedView} onSelect={handleViewChange}/>
            </div>
        </div>
    );
};

export default FeedOptions;
