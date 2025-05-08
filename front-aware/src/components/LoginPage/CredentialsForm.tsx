import React from 'react';
import LoginButton from './LoginButton';

const inputStyle: React.CSSProperties = {
    width: '70%',
    maxWidth: '300px',
    padding: '12px 16px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '2px solid #031A6B',
    backgroundColor: '#F3F3F3',
    color: '#031A6B',
    outline: 'none',
    marginBottom: '16px',
};

const forgotPasswordStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    paddingLeft: '16px',
    marginTop: '-8px',
};


const formStyle: React.CSSProperties = {
    marginTop: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '480px',
};

const responsiveForgotPasswordTextStyle: React.CSSProperties = {
    color: '#031A6B',
    fontSize: '14px',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    paddingLeft: '65px',
};

const CredentialsForm: React.FC = () => {
    return (
        <form style={formStyle}>
            <input
                type="email"
                placeholder="Email address"
                style={inputStyle}
            />
            <input
                type="password"
                placeholder="Password"
                style={inputStyle}
            />
            <div style={forgotPasswordStyle}>
                <p style={responsiveForgotPasswordTextStyle}>Forgot Password?</p>
            </div>

            <LoginButton/>
        </form>
    );
};

export default CredentialsForm;
