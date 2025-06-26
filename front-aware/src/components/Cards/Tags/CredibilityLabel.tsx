import React from 'react';

type CredibilityLevel = 'high' | 'medium' | 'low' | 'unrated';

type Props = {
    level?: string;
};

const trustMap: Record<CredibilityLevel, { label: string; color: string }> = {
    high: {label: 'Reliable Source', color: '#2ecc71'},
    medium: {label: 'Moderate Source', color: '#f39c12'},
    low: {label: 'Unreliable Source', color: '#e74c3c'},
    unrated: {label: 'Under Review', color: '#7f8c8d'},
};

const CredibilityLabel: React.FC<Props> = ({level}) => {
    const normalized = (level || '').trim().toLowerCase();

    const isValid = Object.keys(trustMap).includes(normalized);
    const key = isValid ? (normalized as CredibilityLevel) : 'unrated';

    const {label, color} = trustMap[key];

    return (
        <span
            style={{
                backgroundColor: color,
                color: '#fff',
                padding: '2px 10px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 500,
                marginLeft: '12px',
                whiteSpace: 'nowrap',
            }}
            title={`Credibility rating: ${label}`}
        >
      {label}
    </span>
    );
};

export default CredibilityLabel;
