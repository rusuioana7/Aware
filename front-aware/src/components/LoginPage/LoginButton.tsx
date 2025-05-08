import React from 'react';

const buttonStyle: React.CSSProperties = {
    width: '80%',
    maxWidth: '335px',
    padding: '12px 16px',
    fontSize: '16px',
    borderRadius: '8px',
    backgroundColor: '#D72638',
    color: '#FFFFFF',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    marginTop: '16px',
};

const hoverStyle: React.CSSProperties = {
    backgroundColor: '#E6E6E6',
    color: '#D72638',
    border: '2px solid #D72638',
};

const LoginButton: React.FC = () => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <button
            style={isHovered ? {...buttonStyle, ...hoverStyle} : buttonStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            Login
        </button>
    );
};

export default LoginButton;
