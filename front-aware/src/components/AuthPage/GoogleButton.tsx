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
    border: '1px solid #ddd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    transition: 'all 0.3s ease',
    marginTop: '12px',
};

const googleIconStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
};

interface GoogleButtonProps {
    label?: string;
    mode?: 'login' | 'signup';
}

const GoogleButton: React.FC<GoogleButtonProps> = ({
                                                       label = 'Sign in with Google',
                                                       mode = 'login',
                                                   }) => {
    const handleGoogleLogin = async () => {
        await fetch('http://localhost:3001/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });

        window.location.href = `http://localhost:3001/auth/google/start?mode=${mode}`;
    };

    return (
        <button style={googleButtonStyle} onClick={handleGoogleLogin}>
            <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google Logo"
                style={googleIconStyle}
            />
            {label}
        </button>
    );
};

export default GoogleButton;
