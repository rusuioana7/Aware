import React, {useEffect, useRef, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import FilterLayout from './FilterLayout';
import TopicTag from '../../Cards/Tags/TopicTag';
import {TOPIC_COLORS} from '../../Cards/Tags/TagColor';

const allTopics = Object.keys(TOPIC_COLORS)
    .filter((key) => key !== 'general')
    .map((key) => key.charAt(0).toUpperCase() + key.slice(1));

const FilterPop: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const viewParam = (searchParams.get('view') || 'both') as 'both' | 'articles' | 'threads';
    const sortParam = (searchParams.get('sort') || 'published') as 'published' | 'views';
    const topicParam = searchParams.get('topics')?.split(',').filter(Boolean) || [];

    const [view, setView] = useState<'All' | 'Articles' | 'Threads'>(
        viewParam === 'articles' ? 'Articles' : viewParam === 'threads' ? 'Threads' : 'All'
    );
    const [sortBy, setSortBy] = useState<'Newest' | 'Oldest' | 'Views' | 'Comments'>(
        sortParam === 'views' ? 'Views' : 'Newest'
    );
    const [selectedTopics, setSelectedTopics] = useState<string[]>(topicParam);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
        setSelectedTopics((prev) =>
            prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
        );
    }

    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        const viewValue = view === 'All' ? 'both' : view.toLowerCase();
        const sortValue = sortBy === 'Views' ? 'views' : 'published';

        params.set('view', viewValue);
        params.set('sort', sortValue);
        params.set('topics', selectedTopics.join(','));

        setSearchParams(params);
    }, [view, sortBy, selectedTopics]);

    const sortedSelectedTopics = selectedTopics
        .slice()
        .sort((a, b) => allTopics.indexOf(a) - allTopics.indexOf(b));

    return (
        <div style={{width: '80%', padding: '5px', position: 'relative', userSelect: 'none'}}>
            <h3 style={{fontSize: '22px', fontWeight: 'bold', color: '#000', marginBottom: '10px'}}>
                Filter
            </h3>

            <div style={{flex: 1, height: 1, backgroundColor: '#CCC', marginBottom: 25}}/>

            <FilterLayout<'All' | 'Articles' | 'Threads'>
                label="View"
                options={['All', 'Articles', 'Threads']}
                selected={view}
                onSelect={setView}
            />

            <div style={{marginBottom: 20, position: 'relative'}} ref={dropdownRef}>
                <label
                    style={{
                        fontWeight: 550,
                        color: '#031A6B',
                        display: 'block',
                        marginBottom: 6,
                        cursor: 'pointer',
                        minHeight: 32,
                        marginRight: '5px',
                    }}
                    onClick={() => setDropdownOpen((open) => !open)}
                    aria-haspopup="listbox"
                    aria-expanded={dropdownOpen}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') setDropdownOpen((open) => !open);
                    }}
                >
                    Category:
                    <div style={{display: 'inline-flex', flexWrap: 'wrap', gap: 6, marginTop: 6}}>
                        {sortedSelectedTopics.length === 0 ? (
                            <span style={{color: '#888', fontStyle: 'italic'}}>Select...</span>
                        ) : (
                            sortedSelectedTopics.map((topic) => (
                                <TopicTag key={topic} label={topic} selected={true} style={{userSelect: 'none'}}/>
                            ))
                        )}
                    </div>
                </label>
                {dropdownOpen && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 20,
                            left: 100,
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
                                        e.currentTarget.style.backgroundColor = '#f0f0f0';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = isSelected ? '#e0e7ff' : 'transparent';
                                    }}
                                    role="option"
                                    aria-selected={isSelected}
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            toggleTopic(topic);
                                        }
                                    }}
                                >
                                    <TopicTag
                                        label={topic}
                                        selected={isSelected}
                                        style={{cursor: 'default', userSelect: 'none'}}
                                    />
                                    {isSelected && (
                                        <span style={{color: '#031A6B', fontWeight: 'bold', fontSize: 18}}>✓</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <FilterLayout<'Newest' | 'Oldest' | 'Views' | 'Comments'>
                label="Sort By"
                options={['Newest', 'Views']} // Adjust if others are supported
                selected={sortBy}
                onSelect={setSortBy}
            />
        </div>
    );
};

export default FilterPop;
