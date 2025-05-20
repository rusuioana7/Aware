import React, {useState} from 'react';
import {Link} from 'react-router-dom';

interface ButtonProps {
    label: string;
    to?: string;
    onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({label, to, onClick}) => {
    const [isHovered, setIsHovered] = useState(false);

    const buttonStyle: React.CSSProperties = {
        width: '125px',
        height: '45px',
        backgroundColor: isHovered ? '#009FFD' : 'black',
        color: isHovered ? '#f3f3f3' : 'white',
        borderRadius: '25px',
        margin: '0 10px',
        fontSize: '16px',
        fontWeight: 450,
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Belleza", sans-serif',
        transition: 'background-color 0.3s, color 0.3s',
        textDecoration: 'none',
    };

    const events = {
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
    };

    if (to) {
        return (
            <Link to={to} style={buttonStyle} {...events}>
                {label}
            </Link>
        );
    }

    return (
        <button onClick={onClick} style={buttonStyle} {...events}>
            {label}
        </button>
    );
};

export default Button;
