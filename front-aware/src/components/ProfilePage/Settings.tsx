import React, {useState, useEffect} from 'react';
import {MdOutlineLogout, MdDelete} from 'react-icons/md';
import {CgExport} from 'react-icons/cg';
import {useNavigate} from 'react-router-dom';

const containerStyle: React.CSSProperties = {
    maxWidth: '380px',
    height: '390px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
};

const sectionTitleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#031A6B',
    marginBottom: '16px',
    textAlign: 'center',
};

const rowGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    marginBottom: '20px',
};

const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
};

const labelStyle: React.CSSProperties = {
    fontWeight: 550,
    fontSize: '17px',
    color: '#031A6B',
};

const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: '8px',
    marginRight: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '15px',
};

const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
    justifyContent: 'flex-start',
};

const actionButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: '#031A6B',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
};

const deleteButtonStyle: React.CSSProperties = {
    ...actionButtonStyle,
    backgroundColor: '#e53935',
};

const linkButtonStyle: React.CSSProperties = {
    padding: '6px 14px',
    backgroundColor: '#031A6B',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    minWidth: '80px',
};

const unlinkButtonStyle: React.CSSProperties = {
    ...linkButtonStyle,
    backgroundColor: '#e53935',
};

const Settings: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [editEmail, setEditEmail] = useState(false);
    const [editPassword, setEditPassword] = useState(false);
    const [isProfilePublic, setIsProfilePublic] = useState(true);

    const getToken = () => localStorage.getItem('authToken') || '';
    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
    });

    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await fetch('http://localhost:3001/settings/export', {
                    method: 'GET',
                    headers: getAuthHeaders(),
                });
                if (!res.ok) {
                    if (res.status === 401) {
                        navigate('/login');
                        return;
                    }
                    throw new Error(`Failed to load settings (${res.status})`);
                }
                const data = await res.json();
                setEmail(data.email);
                setPassword('********');
                setIsProfilePublic(data.isPublic);
            } catch (err) {
                console.error(err);
            }
        }

        fetchSettings();
    }, [navigate]);

    const handleSaveEmail = async () => {
        try {
            const res = await fetch('http://localhost:3001/settings/email', {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({newEmail: email}),
            });
            if (!res.ok) throw new Error('Update email failed');
            setEditEmail(false);
        } catch (e) {
            alert(e);
        }
    };

    const handleSavePassword = async () => {
        try {
            const res = await fetch('http://localhost:3001/settings/password', {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({newPassword: password}),
            });
            if (!res.ok) throw new Error('Update password failed');
            setEditPassword(false);
            setPassword('********');
        } catch (e) {
            alert(e);
        }
    };

    const handleToggleVisibility = async () => {
        try {
            const res = await fetch('http://localhost:3001/settings/visibility', {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({isPublic: !isProfilePublic}),
            });
            if (!res.ok) throw new Error('Update visibility failed');
            const data = await res.json();
            setIsProfilePublic(data.isPublic);
        } catch (e) {
            alert(e);
        }
    };

    const handleLogout = async () => {
        await fetch('http://localhost:3001/settings/logout', {method: 'POST', credentials: 'include'});
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure?')) return;
        await fetch('http://localhost:3001/settings/account', {method: 'DELETE', headers: getAuthHeaders()});
        localStorage.removeItem('authToken');
        navigate('/');
    };

    const handleExportData = async () => {
        const res = await fetch('http://localhost:3001/settings/export', {method: 'GET', headers: getAuthHeaders()});
        if (!res.ok) throw new Error('Export failed');
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'user_data.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div style={containerStyle}>
            <div style={sectionTitleStyle}>Account Settings</div>
            <div style={rowGroupStyle}>
                <div style={rowStyle}>
                    <span style={labelStyle}>Email:</span>
                    {editEmail ? (
                        <>
                            <input style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)}/>
                            <button style={actionButtonStyle} onClick={handleSaveEmail}>Save</button>
                        </>
                    ) : (
                        <>
                            <span>{email}</span>
                            <button style={actionButtonStyle} onClick={() => setEditEmail(true)}>Edit</button>
                        </>
                    )}
                </div>
                {/* Password row */}
                <div style={rowStyle}>
                    <span style={labelStyle}>Password:</span>
                    {editPassword ? (
                        <>
                            <input type="password" style={inputStyle} value={password}
                                   onChange={(e) => setPassword(e.target.value)}/>
                            <button style={actionButtonStyle} onClick={handleSavePassword}>Update Password</button>
                        </>
                    ) : (
                        <>
                            <span>{password}</span>
                            <button style={actionButtonStyle} onClick={() => setEditPassword(true)}>Edit</button>
                        </>
                    )}
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>Profile Visibility:</span>
                    <button
                        style={isProfilePublic ? unlinkButtonStyle : linkButtonStyle}
                        onClick={handleToggleVisibility}
                    >
                        {isProfilePublic ? 'Make Private' : 'Make Public'}
                    </button>
                </div>
            </div>
            <div style={buttonGroupStyle}>
                <button style={actionButtonStyle} onClick={handleLogout}>
                    <MdOutlineLogout size={18}/> Logout
                </button>
                <button style={deleteButtonStyle} onClick={handleDeleteAccount}>
                    <MdDelete size={18}/> Delete Account
                </button>
                <button style={actionButtonStyle} onClick={handleExportData}>
                    <CgExport size={18}/> Export Data
                </button>
            </div>
        </div>
    );
};

export default Settings;
