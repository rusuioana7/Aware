import React from 'react';

type CredibilityStatus = 'true' | 'mostly-true' | 'missing-context' | 'false' | 'unverified';

type Props = {
    status: CredibilityStatus;
};

const statusMap: Record<CredibilityStatus, { label: string; color: string }> = {
    true: {label: 'True', color: '#27ae60'},
    'mostly-true': {label: 'Mostly True', color: '#2ecc71'},
    'missing-context': {label: 'Missing Context', color: '#f1c40f'},
    false: {label: 'False', color: '#e74c3c'},
    'unverified': {label: 'Unverified', color: '#95a5a6'},
};

const CredibilityLabel: React.FC<Props> = ({status}) => {
    const {label, color} = statusMap[status];

    return (
        <span
            style={{
                backgroundColor: color,
                color: '#fff',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 500,
                marginLeft: '12px',
                whiteSpace: 'nowrap',
            }}
            title={`This article is marked as: ${label}`}
        >
            {label}
        </span>
    );
};

export default CredibilityLabel;
