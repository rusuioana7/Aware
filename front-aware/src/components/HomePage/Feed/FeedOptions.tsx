import React, {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import TopicTag from '../../Cards/Tags/TopicTag.tsx';
import {TOPIC_COLORS} from '../../Cards/Tags/TagColor.tsx';
import SortSelector from '../../Cards/SelectMenu/SelectSort.tsx';
import ViewSelector from '../../Cards/SelectMenu/SelectView.tsx';

type FeedOptionsProps = {
    onViewChange: (view: 'All' | 'Articles' | 'Threads') => void;
    onTopicChange: (topics: string[]) => void;
    onSortChange: (sort: 'Newest' | 'Popular') => void;
};

const sortOptions: Array<'Newest' | 'Popular'> = ['Newest', 'Popular'];
const viewOptions: Array<'All' | 'Articles' | 'Threads'> = ['All', 'Articles', 'Threads'];

const FeedOptions: React.FC<FeedOptionsProps> = ({onViewChange, onTopicChange, onSortChange}) => {
    const allTopics = Object.keys(TOPIC_COLORS)
        .filter(key => key !== 'general')
        .map(key => key.charAt(0).toUpperCase() + key.slice(1));

    const location = useLocation();
    const navigate = useNavigate();
    const search = new URLSearchParams(location.search);
    const initialTopics = search.get('topics')?.split(',').filter(Boolean) || [];
    const initialView = (search.get('view') as 'All' | 'Articles' | 'Threads') || 'All';
    const initialSort = (search.get('sort') as 'Newest' | 'Popular') || 'Newest';

    const [selectedTopics, setSelectedTopics] = useState<string[]>(initialTopics);
    const [selectedView, setSelectedView] = useState<'All' | 'Articles' | 'Threads'>(initialView);
    const [selectedSort, setSelectedSort] = useState<'Newest' | 'Popular'>(initialSort);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        onTopicChange(selectedTopics);
    }, []);

    const toggleTopic = (topic: string) => {
        const updated = selectedTopics.includes(topic)
            ? selectedTopics.filter(t => t !== topic)
            : [...selectedTopics, topic];

        const query = new URLSearchParams(location.search);
        if (updated.length) query.set('topics', updated.join(','));
        else query.delete('topics');

        navigate({pathname: location.pathname, search: query.toString()});
        setSelectedTopics(updated);
        onTopicChange(updated);
    };

    const handleViewChange = (option: 'All' | 'Articles' | 'Threads') => {
        const query = new URLSearchParams(location.search);

        query.set('view', option);
        const feedType = option === 'All' ? 'both' : option.toLowerCase();
        query.set('feed_type', feedType);

        navigate({pathname: location.pathname, search: query.toString()});

        setSelectedView(option);
        onViewChange(option);
    };


    const handleSortChange = (option: 'Newest' | 'Popular') => {
        const query = new URLSearchParams(location.search);
        query.set('sort', option);
        navigate({pathname: location.pathname, search: query.toString()});

        setSelectedSort(option);
        onSortChange(option);
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

    const sortedSelectedTopics = selectedTopics.slice().sort(
        (a, b) => allTopics.indexOf(a) - allTopics.indexOf(b)
    );

    return (
        <div>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                marginBottom: 7,
                marginTop: 15,
                paddingLeft: 5,
                paddingRight: 5,
            }}>
                <h2 style={{fontSize: 22, fontWeight: 'bold', color: '#000', margin: 0, flexShrink: 0}}>
                    Feed
                </h2>

                <div style={{
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    flexWrap: 'wrap',
                    position: 'relative',
                }} ref={dropdownRef}>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 8,
                        justifyContent: 'center',
                        flexGrow: 1,
                    }}>
                        {sortedSelectedTopics.map(topic => (
                            <TopicTag key={topic} label={topic} onClick={() => toggleTopic(topic)} selected={true}/>
                        ))}
                    </div>

                    <button
                        onClick={() => setDropdownOpen(open => !open)}
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
                            marginLeft: 12,
                        }}
                        title="Add topic"
                    >
                        +
                    </button>

                    {dropdownOpen && (
                        <div style={{
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
                        }}>
                            {allTopics.map(topic => {
                                const isSelected = selectedTopics.includes(topic);
                                return (
                                    <div
                                        key={topic}
                                        onClick={() => toggleTopic(topic)}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            gap: 8,
                                            padding: '6px 10px',
                                            borderRadius: 6,
                                            cursor: 'pointer',
                                            backgroundColor: isSelected ? '#e0e7ff' : 'transparent',
                                        }}
                                    >
                                        <TopicTag
                                            label={topic}
                                            selected={isSelected}
                                            style={{cursor: 'default'}}
                                        />
                                        {isSelected && <span style={{
                                            color: '#031A6B',
                                            fontWeight: 'bold',
                                            fontSize: 18,
                                        }}>✓</span>}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div style={{height: 1, backgroundColor: '#CCC', marginBottom: 16}}/>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 60,
                flexWrap: 'wrap',
                marginBottom: 10,
            }}>
                <SortSelector options={sortOptions} selected={selectedSort} onSelect={handleSortChange}/>
                <ViewSelector options={viewOptions} selected={selectedView} onSelect={handleViewChange}/>

            </div>
        </div>
    );
};

export default FeedOptions;
