import React, {useState} from 'react';
import AuthButton from './AuthButton.tsx';
import {useNavigate} from 'react-router-dom';

interface CredentialsFormProps {
    mode: 'login' | 'signup';
}

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

const responsiveForgotPasswordTextStyle: React.CSSProperties = {
    color: '#031A6B',
    fontSize: '14px',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    paddingLeft: '65px',
};

const formStyle: React.CSSProperties = {
    marginTop: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '480px',
};

const CredentialsForm: React.FC<CredentialsFormProps> = ({mode}) => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const url = mode === 'login' ? '/auth/login' : '/auth/register';
            type Payload = { email: string; password: string; confirmPassword?: string };
            const body: Payload = {email, password};
            if (mode === 'signup') {
                body.confirmPassword = confirmPassword;
            }

            const response = await fetch(`http://localhost:3001${url}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Something went wrong');
                return;
            }
            const {accessToken} = await response.json();
            localStorage.setItem('authToken', accessToken);


            if (mode === 'login') {
                if (email.toLowerCase() === 'admin@aware.com') {
                    navigate('/manage-users', {replace: true});
                } else {
                    navigate('/home', {replace: true});
                }
            } else {
                navigate('/createprofile', {state: {email}});
            }

        } catch (err) {
            console.log(err);
            setError('Network error');
        }
    };

    return (
        <form style={formStyle} onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Email address"
                style={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                style={inputStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
            />

            {mode === 'signup' && (
                <input
                    type="password"
                    placeholder="Confirm Password"
                    style={inputStyle}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                />
            )}

            {mode === 'login' && (
                <div style={forgotPasswordStyle}>
                    <p style={responsiveForgotPasswordTextStyle}>Forgot Password?</p>
                </div>
            )}

            {error && <p style={{color: 'red'}}>{Array.isArray(error) ? error.join(', ') : error}</p>}

            <AuthButton label={mode === 'login' ? 'Login' : 'Register'}/>
        </form>
    );
};

export default CredentialsForm;
