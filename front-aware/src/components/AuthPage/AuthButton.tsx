import React from 'react';

interface LoginButtonProps {
    label: string;
}

const buttonStyle: React.CSSProperties = {
    width: '335px',
    padding: '12px 16px',
    fontSize: '16px',
    borderRadius: '8px',
    backgroundColor: '#D72638',
    color: '#FFFFFF',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
};

const hoverStyle: React.CSSProperties = {
    backgroundColor: '#E6E6E6',
    color: '#D72638',
    border: '2px solid #D72638',
};

const AuthButton: React.FC<LoginButtonProps> = ({label}) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <button
            style={isHovered ? {...buttonStyle, ...hoverStyle} : buttonStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {label}
        </button>
    );
};

export default AuthButton;
