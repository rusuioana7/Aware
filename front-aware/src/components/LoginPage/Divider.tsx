import React from 'react';

const Divider: React.FC = () => {
    return (
        <div style={{
            width: '70%',
            maxWidth: '360px',
            display: 'flex',
            alignItems: 'center',
            margin: '24px 0',
            marginLeft: 'auto',
            marginRight: 'auto'
        }}>
            <div style={{flex: 1, height: '1px', backgroundColor: '#CCCCCC'}}/>
            <span style={{margin: '0 12px', color: '#666666', fontSize: '14px'}}>or</span>
            <div style={{flex: 1, height: '1px', backgroundColor: '#CCCCCC'}}/>
        </div>
    );
};

export default Divider;
