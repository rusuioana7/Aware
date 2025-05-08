import React from 'react';

const googleButtonStyle: React.CSSProperties = {
    width: '80%',
    maxWidth: '340px',
    padding: '12px 16px',
    fontSize: '16px',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    outline: 'none',
    cursor: 'pointer',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    transition: 'all 0.3s ease',
    marginTop: '2px',
};

const googleIconStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
};

const GoogleButton: React.FC = () => {
    return (
        <button style={googleButtonStyle}>
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                alt="Google Logo"
                style={googleIconStyle}
            />
            Sign in with Google
        </button>
    );
};

export default GoogleButton;
