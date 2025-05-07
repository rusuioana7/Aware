import React, {useState} from 'react';

const Button: React.FC<{ label: string }> = ({label}) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    return (
        <button
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                width: '125px',
                height: '45px',
                backgroundColor: isHovered ? '#009FFD' : 'black',
                color: isHovered ? '#f3f3f3' : 'white',
                borderRadius: '25px',
                margin: '0 10px',
                fontSize: '16px',
                fontWeight: '450',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: '"Belleza", sans-serif',
                transition: 'background-color 0.3s, color 0.3s',
            }}
        >
            {label}
        </button>
    );
};

export default Button;
