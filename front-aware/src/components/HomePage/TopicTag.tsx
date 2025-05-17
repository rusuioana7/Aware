import React from 'react';
import {TOPIC_COLORS} from './TagColor.tsx';

interface TopicTagProps {
    label: string;
    style?: React.CSSProperties;
    positionTopLeft?: boolean;
    onClick?: () => void;
    selected?: boolean;
}

const TopicTag: React.FC<TopicTagProps> = ({
                                               label,
                                               style = {},
                                               positionTopLeft = false,
                                               onClick,
                                               selected = false,
                                           }) => {
    const key = label.toLowerCase();
    const color = TOPIC_COLORS[key] || TOPIC_COLORS.general;
    const finalLabel = TOPIC_COLORS[key] ? label : 'General';

    const interactiveStyle: React.CSSProperties = onClick
        ? {
            cursor: 'pointer',
            border: `1px solid ${color}`,
            backgroundColor: selected ? color : 'transparent',
            color: selected ? 'white' : color,
            transition: 'all 0.2s ease-in-out',
        }
        : {
            backgroundColor: color,
            color: 'white',
        };

    return (
        <span
            onClick={onClick}
            style={{
                display: 'inline-block',
                fontSize: 14,
                fontWeight: 500,
                padding: '4px 10px',
                textTransform: 'capitalize',
                width: 'fit-content',
                position: positionTopLeft ? 'absolute' : 'relative',
                top: positionTopLeft ? 8 : undefined,
                left: positionTopLeft ? 8 : undefined,
                zIndex: positionTopLeft ? 3 : undefined,
                ...interactiveStyle,
                ...style,
            }}
        >
      {finalLabel}
    </span>
    );
};

export default TopicTag;
