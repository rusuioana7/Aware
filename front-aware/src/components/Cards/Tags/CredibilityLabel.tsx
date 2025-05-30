import React from 'react';

type SourceTrustStatus = 'verified' | 'unknown' | 'suspicious' | 'untrustworthy' | 'under-review';

type Props = {
    status: SourceTrustStatus;
};

const trustMap: Record<SourceTrustStatus, { label: string; color: string }> = {
    verified: {label: 'Verified Source', color: '#2ecc71'},
    unknown: {label: 'Unknown Source', color: '#95a5a6'},
    suspicious: {label: 'Suspicious', color: '#e67e22'},
    untrustworthy: {label: 'Untrustworthy', color: '#e74c3c'},
    'under-review': {label: 'Under Review', color: '#3498db'},
};

const CredibilityLabel: React.FC<Props> = ({status}) => {
    const {label, color} = trustMap[status];

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
            title={`Source rating: ${label}`}
        >
            {label}
        </span>
    );
};

export default CredibilityLabel;
