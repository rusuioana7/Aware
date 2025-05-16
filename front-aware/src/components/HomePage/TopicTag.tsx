import React from 'react';

const TOPIC_COLORS: Record<string, string> = {
    sport: '#22c55e',
    health: '#3b82f6',
    economy: '#ef4444',
    tech: '#f59e0b',
    climate: '#10b981',
    politics: '#8b5cf6',
    entertainment: '#ec4899',
    science: '#14b8a6',
    travel: '#f97316',
    education: '#3b82f6',
    world: '#6b7280',
    business: '#2563eb',
    culture: '#a855f9',
    food: '#eab308',
    lifestyle: '#db2777',
    automotive: '#6366f1',
    weather: '#0ea5e9',
    crime: '#ef4444',
    opinion: '#f43f5e',
    local: '#16a34a',
    all: '#000000',
    general: '#BDBDBD',
};

interface TopicTagProps {
    label: string;
    style?: React.CSSProperties;
    positionTopLeft?: boolean;
}

const TopicTag: React.FC<TopicTagProps> = ({label, style = {}, positionTopLeft = false}) => {
    const key = label.toLowerCase();
    const color = TOPIC_COLORS[key] || TOPIC_COLORS.general;
    const finalLabel = TOPIC_COLORS[key] ? label : 'General';

    return (
        <span
            style={{
                display: 'inline-block',
                backgroundColor: color,
                color: 'white',
                fontSize: 14,
                fontWeight: 500,
                padding: '4px 10px',
                textTransform: 'capitalize',
                width: 'fit-content',
                position: positionTopLeft ? 'absolute' : 'relative',
                top: positionTopLeft ? 8 : undefined,
                left: positionTopLeft ? 8 : undefined,
                zIndex: positionTopLeft ? 3 : undefined,
                ...style,
            }}
        >
            {finalLabel}
        </span>
    );
};

export default TopicTag;
