import React, {useState, useEffect, useRef} from 'react';
import FilterLayout from './FilterLayout';
import TopicTag from '../Cards/Tags/TopicTag';
import {TOPIC_COLORS} from "../Cards/Tags/TagColor.tsx";

const allTopics = Object.keys(TOPIC_COLORS)
    .filter(key => key !== 'general')
    .map(key => key.charAt(0).toUpperCase() + key.slice(1));

const timeToReadOptions = ['<1 min', '<5 min', '<10 min', '<20 min', '20 min+'] as const;

type TimeToReadOption = typeof timeToReadOptions[number];

const SideFilter: React.FC = () => {
    // Single select
    const [view, setView] = useState<'All' | 'Articles' | 'Threads'>('All');
    const [dateRange, setDateRange] = useState<'All' | 'Today' | 'Week' | 'Month'>('All');
    const [sortBy, setSortBy] = useState<'Newest' | 'Oldest' | 'Views' | 'Comments'>('Newest');
    const [length, setLength] = useState<'All' | 'Short' | 'Medium' | 'Long'>('All');
    const [readingTime, setReadingTime] = useState<TimeToReadOption>('20 min+');


    // Multi-select categories with dropdown
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown if click outside
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

    function toggleTopic(topic: string) {
        setSelectedTopics(prev =>
            prev.includes(topic)
                ? prev.filter(t => t !== topic)
                : [...prev, topic]
        );
    }

    const sortedSelectedTopics = selectedTopics
        .slice()
        .sort((a, b) => allTopics.indexOf(a) - allTopics.indexOf(b));

    return (
        <div style={{
            width: '110%',
            padding: '5px',
            marginLeft: '-50px',
            position: 'relative',
            userSelect: 'none',
        }}>
            <h3 style={{
                fontSize: '22px',
                fontWeight: 'bold',
                color: '#000',
                marginBottom: '10px',
            }}>Filter</h3>

            <div style={{flex: 1, height: 1, backgroundColor: '#CCC', marginBottom: 15}}/>

            <FilterLayout<'All' | 'Articles' | 'Threads'>
                label="View"
                options={['All', 'Articles', 'Threads']}
                selected={view}
                onSelect={setView}
            />

            {/* Category dropdown */}
            <div style={{marginBottom: 20, position: 'relative'}} ref={dropdownRef}>
                <label
                    style={{
                        fontWeight: 550,
                        color: '#031A6B',
                        display: 'block',
                        marginBottom: 6,
                        cursor: 'pointer',
                        minHeight: 32,
                        marginRight: '5px'
                    }}
                    onClick={() => setDropdownOpen(open => !open)}
                    aria-haspopup="listbox"
                    aria-expanded={dropdownOpen}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') setDropdownOpen(open => !open)
                    }}
                >
                    Category:
                    <div style={{display: 'inline-flex', flexWrap: 'wrap', gap: 6, marginTop: 6}}>
                        {sortedSelectedTopics.length === 0 ? (
                            <span style={{color: '#888', fontStyle: 'italic'}}>Select...</span>
                        ) : (
                            sortedSelectedTopics.map(topic => (
                                <TopicTag key={topic} label={topic} selected={true} style={{userSelect: 'none'}}/>
                            ))
                        )}
                    </div>
                </label>
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


            <FilterLayout<'All' | 'Today' | 'Week' | 'Month'>
                label="Date Range"
                options={['All', 'Today', 'Week', 'Month']}
                selected={dateRange}
                onSelect={setDateRange}
            />

            <FilterLayout<'Newest' | 'Oldest' | 'Views' | 'Comments'>
                label="Sort By"
                options={['Newest', 'Oldest', 'Views', 'Comments']}
                selected={sortBy}
                onSelect={setSortBy}
            />

            <FilterLayout<'All' | 'Short' | 'Medium' | 'Long'>
                label="Content Length"
                options={['All', 'Short', 'Medium', 'Long']}
                selected={length}
                onSelect={setLength}
            />

            {/* Time to Read buttons */}
            <div style={{marginBottom: 16}}>
                <label style={{fontWeight: 550, color: '#031A6B', display: 'block', marginBottom: 6}}>
                    Time to Read:
                </label>
                <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                    {timeToReadOptions.map(option => (
                        <button
                            key={option}
                            onClick={() => setReadingTime(option)}
                            style={{
                                border: '1px solid #031A6B',
                                backgroundColor: readingTime === option ? '#031A6B' : 'transparent',
                                color: readingTime === option ? 'white' : '#031A6B',
                                borderRadius: 25,
                                padding: '6px 16px',
                                fontSize: 14,
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease-in-out',
                            }}
                            aria-pressed={readingTime === option}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>


        </div>
    );
};

export default SideFilter;
