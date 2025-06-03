import React, {useState, useEffect} from 'react';
import {MdOutlineLogout, MdDelete} from 'react-icons/md';
import {CgExport} from 'react-icons/cg';
import {useNavigate} from 'react-router-dom';

const containerStyle: React.CSSProperties = {
    maxWidth: '100%',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
};

const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
};

const sectionTitleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#031A6B',
};

const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
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

const rowGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: '40px',
    flexWrap: 'wrap',
    marginBottom: '20px',
};

const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    minWidth: '300px',
};

const labelStyle: React.CSSProperties = {
    width: '80px',
    fontWeight: 550,
    fontSize: '17px',
};

const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: '8px',
    marginRight: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '15px',
};

const editButtonStyle: React.CSSProperties = {
    padding: '6px 12px',
    backgroundColor: '#031A6B',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
};

const notificationSectionStyle: React.CSSProperties = {
    marginTop: '10px',
};

const notificationHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
};

const notificationTitleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#031A6B',
};

const notificationGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    marginBottom: '20px',
};

const notificationRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
};


const toggleSwitchStyle: React.CSSProperties = {
    position: 'relative',
    width: '40px',
    height: '20px',
};

const toggleCheckboxStyle: React.CSSProperties = {
    opacity: 0,
    width: 0,
    height: 0,
};

const toggleSliderStyle: React.CSSProperties = {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ccc',
    borderRadius: '20px',
    transition: '.4s',
};

const toggleSliderBeforeStyle: React.CSSProperties = {
    position: 'absolute',
    height: '16px',
    width: '16px',
    left: '2px',
    bottom: '2px',
    backgroundColor: 'white',
    borderRadius: '50%',
    transition: '.4s',
    transform: 'translateX(0)',
};

interface ToggleProps {
    checked: boolean;
    onChange: () => void;
    disabled?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({checked, onChange, disabled}) => (
    <label style={toggleSwitchStyle}>
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            style={toggleCheckboxStyle}
        />
        <span
            style={{
                ...toggleSliderStyle,
                backgroundColor: checked ? '#031A6B' : '#ccc',
            }}
        >
      <span
          style={{
              ...toggleSliderBeforeStyle,
              transform: checked ? 'translateX(20px)' : 'translateX(0)',
          }}
      />
    </span>
    </label>
);

const profileVisibilityStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '20px',
    width: '50%',
};

const connectedAccountsContainerStyle: React.CSSProperties = {
    marginTop: '20px',
    width: '50%',
};

const connectedRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px',
    borderRadius: '6px',
};

const accountNameStyle: React.CSSProperties = {
    fontWeight: 600,
    fontSize: '16px',
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
    const [editEmail, setEditEmail] = useState<boolean>(false);
    const [editPassword, setEditPassword] = useState<boolean>(false);

    const [notifyWeeklyEmail, setNotifyWeeklyEmail] = useState<boolean>(false);
    const [notifyDailyEmail, setNotifyDailyEmail] = useState<boolean>(false);
    const [notifyTopicAlertsEmail, setNotifyTopicAlertsEmail] = useState<boolean>(false);
    const [notifyWeeklyPush, setNotifyWeeklyPush] = useState<boolean>(false);
    const [notifyDailyPush, setNotifyDailyPush] = useState<boolean>(false);
    const [notifyTopicAlertsPush, setNotifyTopicAlertsPush] = useState<boolean>(false);

    const [isProfilePublic, setIsProfilePublic] = useState<boolean>(true);

    const [linkedGoogle, setLinkedGoogle] = useState<boolean>(false);

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

                setNotifyWeeklyEmail(data.notifyWeeklyEmail);
                setNotifyDailyEmail(data.notifyDailyEmail);
                setNotifyTopicAlertsEmail(data.notifyTopicAlertsEmail);
                setNotifyWeeklyPush(data.notifyWeeklyPush);
                setNotifyDailyPush(data.notifyDailyPush);
                setNotifyTopicAlertsPush(data.notifyTopicAlertsPush);

                setIsProfilePublic(data.isPublic);

                setLinkedGoogle(data.provider === 'google');

                setPassword('********');
            } catch (err) {
                console.error('Error fetching settings:', err);
            }
        }

        fetchSettings();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:3001/settings/logout', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
            });

            localStorage.removeItem('authToken');
            navigate('/login');
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
            return;
        }
        try {
            const res = await fetch('http://localhost:3001/settings/account', {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Delete account failed');
            }
            localStorage.removeItem('authToken');
            navigate('/');
        } catch (err) {
            console.error('Delete account failed', err);
            alert('Error deleting account');
        }
    };

    const handleExportData = async () => {
        try {
            const res = await fetch('http://localhost:3001/settings/export', {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            if (!res.ok) {
                throw new Error(`Export failed (${res.status})`);
            }
            const data = await res.json();
            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: 'application/json',
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'user_data.json';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Export data failed', err);
            alert('Error exporting data');
        }
    };

    const handleSaveEmail = async () => {
        try {
            const res = await fetch('http://localhost:3001/settings/email', {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({newEmail: email}),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Update email failed');
            }
            setEditEmail(false);
        } catch (err: unknown) {
            console.error('Update email failed', err);
            if (err instanceof Error) {
                alert(`Error updating email: ${err.message}`);
            } else {
                alert(`Error updating email: ${String(err)}`);
            }
        }
    };

    const handleSavePassword = async () => {
        try {
            const res = await fetch('http://localhost:3001/settings/password', {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({newPassword: password}),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Update password failed');
            }
            setEditPassword(false);
            setPassword('********');
        } catch (err: unknown) {
            console.error('Update password failed', err);
            if (err instanceof Error) {
                alert(`Error updating password: ${err.message}`);
            } else {
                alert(`Error updating password: ${String(err)}`);
            }
        }
    };

    const handleToggleNotifications = async () => {
        const payload = {
            notifyWeeklyEmail,
            notifyDailyEmail,
            notifyTopicAlertsEmail,
            notifyWeeklyPush,
            notifyDailyPush,
            notifyTopicAlertsPush,
        };
        try {
            const res = await fetch('http://localhost:3001/settings/notifications', {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to update notifications');
            }
        } catch (err: unknown) {
            console.error('Update notifications failed', err);
            if (err instanceof Error) {
                alert(`Error updating notifications: ${err.message}`);
            } else {
                alert(`Error updating notifications: ${String(err)}`);
            }
        }
    };


    const handleToggleVisibility = async () => {
        try {
            const res = await fetch('http://localhost:3001/settings/visibility', {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({isPublic: !isProfilePublic}),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Update visibility failed');
            }
            const data = await res.json();
            setIsProfilePublic(data.isPublic);
        } catch (err: unknown) {
            console.error('Update visibility failed', err);
            if (err instanceof Error) {
                alert(`Error updating visibility: ${err.message}`);
            } else {
                alert(`Error updating visibility: ${String(err)}`);
            }
        }
    };

    const handleUnlinkGoogle = async () => {
        if (!window.confirm('Are you sure you want to unlink your Google account?')) return;
        try {
            const res = await fetch('http://localhost:3001/settings/unlink', {
                method: 'DELETE',
                headers: getAuthHeaders(),
                body: JSON.stringify({provider: 'google'}),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Unlink Google failed');
            }
            setLinkedGoogle(false);
        } catch (err: unknown) {
            console.error('Update unlink failed', err);
            if (err instanceof Error) {
                alert(`Error updating unlink: ${err.message}`);
            } else {
                alert(`Error updating unlink: ${String(err)}`);
            }
        }
    };

    return (
        <div style={containerStyle}>
            {/* header */}
            <div style={headerStyle}>
                <div style={sectionTitleStyle}>Account</div>
                <div style={buttonGroupStyle}>
                    <button style={actionButtonStyle} onClick={handleLogout}>
                        <MdOutlineLogout size={18}/>
                        Logout
                    </button>
                    <button style={deleteButtonStyle} onClick={handleDeleteAccount}>
                        <MdDelete size={18}/>
                        Delete Account
                    </button>
                    <button style={actionButtonStyle} onClick={handleExportData}>
                        <CgExport size={18}/>
                        Export Data
                    </button>
                </div>
            </div>

            {/* email + password */}
            <div style={rowGroupStyle}>
                <div style={rowStyle}>
                    <div style={labelStyle}>Email:</div>
                    {editEmail ? (
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={inputStyle}
                        />
                    ) : (
                        <div style={{flex: 1, marginRight: '10px'}}>{email}</div>
                    )}
                    {editEmail ? (
                        <button style={editButtonStyle} onClick={handleSaveEmail}>
                            Save
                        </button>
                    ) : (
                        <button style={editButtonStyle} onClick={() => setEditEmail(true)}>
                            Edit
                        </button>
                    )}
                </div>

                <div style={rowStyle}>
                    <div style={labelStyle}>Password:</div>
                    {editPassword ? (
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                        />
                    ) : (
                        <div style={{flex: 1, marginRight: '10px'}}>{password}</div>
                    )}
                    {editPassword ? (
                        <button style={editButtonStyle} onClick={handleSavePassword}>
                            Save
                        </button>
                    ) : (
                        <button style={editButtonStyle} onClick={() => setEditPassword(true)}>
                            Edit
                        </button>
                    )}
                </div>
            </div>

            {/* notifications */}
            <div style={notificationSectionStyle}>
                <div style={notificationHeaderStyle}>
                    <div style={notificationTitleStyle}>Notifications</div>
                    <button style={actionButtonStyle} onClick={handleToggleNotifications}>
                        Save
                    </button>
                </div>

                <div style={notificationGridStyle}>
                    {/* email notifications */}
                    <div>
                        <div style={notificationRowStyle}>
                            <div>Email Notifications</div>
                            <Toggle
                                checked={notifyWeeklyEmail || notifyDailyEmail || notifyTopicAlertsEmail}
                                onChange={() => {
                                    const newVal = !(
                                        notifyWeeklyEmail ||
                                        notifyDailyEmail ||
                                        notifyTopicAlertsEmail
                                    );
                                    setNotifyWeeklyEmail(newVal);
                                    setNotifyDailyEmail(newVal);
                                    setNotifyTopicAlertsEmail(newVal);
                                }}
                            />
                        </div>
                        <div
                            style={{
                                marginLeft: '10px',
                                opacity:
                                    notifyWeeklyEmail ||
                                    notifyDailyEmail ||
                                    notifyTopicAlertsEmail
                                        ? 1
                                        : 0.5,
                            }}
                        >
                            <div style={notificationRowStyle}>
                                <div>Weekly Summary (Email)</div>
                                <Toggle
                                    checked={notifyWeeklyEmail}
                                    onChange={() => setNotifyWeeklyEmail((prev) => !prev)}
                                    disabled={
                                        !(
                                            notifyWeeklyEmail ||
                                            notifyDailyEmail ||
                                            notifyTopicAlertsEmail
                                        )
                                    }
                                />
                            </div>
                            <div style={notificationRowStyle}>
                                <div>Daily Summary (Email)</div>
                                <Toggle
                                    checked={notifyDailyEmail}
                                    onChange={() => setNotifyDailyEmail((prev) => !prev)}
                                    disabled={
                                        !(
                                            notifyWeeklyEmail ||
                                            notifyDailyEmail ||
                                            notifyTopicAlertsEmail
                                        )
                                    }
                                />
                            </div>
                            <div style={notificationRowStyle}>
                                <div>Topic Alerts (Email)</div>
                                <Toggle
                                    checked={notifyTopicAlertsEmail}
                                    onChange={() => setNotifyTopicAlertsEmail((prev) => !prev)}
                                    disabled={
                                        !(
                                            notifyWeeklyEmail ||
                                            notifyDailyEmail ||
                                            notifyTopicAlertsEmail
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* push notifications */}
                    <div>
                        <div style={notificationRowStyle}>
                            <div>Push Notifications</div>
                            <Toggle
                                checked={
                                    notifyWeeklyPush ||
                                    notifyDailyPush ||
                                    notifyTopicAlertsPush
                                }
                                onChange={() => {
                                    const newVal = !(
                                        notifyWeeklyPush ||
                                        notifyDailyPush ||
                                        notifyTopicAlertsPush
                                    );
                                    setNotifyWeeklyPush(newVal);
                                    setNotifyDailyPush(newVal);
                                    setNotifyTopicAlertsPush(newVal);
                                }}
                            />
                        </div>
                        <div
                            style={{
                                marginLeft: '10px',
                                opacity:
                                    notifyWeeklyPush ||
                                    notifyDailyPush ||
                                    notifyTopicAlertsPush
                                        ? 1
                                        : 0.5,
                            }}
                        >
                            <div style={notificationRowStyle}>
                                <div>Weekly Summary (Push)</div>
                                <Toggle
                                    checked={notifyWeeklyPush}
                                    onChange={() => setNotifyWeeklyPush((prev) => !prev)}
                                    disabled={
                                        !(
                                            notifyWeeklyPush ||
                                            notifyDailyPush ||
                                            notifyTopicAlertsPush
                                        )
                                    }
                                />
                            </div>
                            <div style={notificationRowStyle}>
                                <div>Daily Summary (Push)</div>
                                <Toggle
                                    checked={notifyDailyPush}
                                    onChange={() => setNotifyDailyPush((prev) => !prev)}
                                    disabled={
                                        !(
                                            notifyWeeklyPush ||
                                            notifyDailyPush ||
                                            notifyTopicAlertsPush
                                        )
                                    }
                                />
                            </div>
                            <div style={notificationRowStyle}>
                                <div>Topic Alerts (Push)</div>
                                <Toggle
                                    checked={notifyTopicAlertsPush}
                                    onChange={() =>
                                        setNotifyTopicAlertsPush((prev) => !prev)
                                    }
                                    disabled={
                                        !(
                                            notifyWeeklyPush ||
                                            notifyDailyPush ||
                                            notifyTopicAlertsPush
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* connected accounts + visibility */}
            <div style={connectedAccountsContainerStyle}>
                <div style={sectionTitleStyle}>Connected Accounts</div>

                <div style={connectedRowStyle}>
                    <div style={accountNameStyle}>Google</div>
                    {linkedGoogle ? (
                        <button style={unlinkButtonStyle} onClick={handleUnlinkGoogle}>
                            Unlink
                        </button>
                    ) : (
                        <button
                            style={linkButtonStyle}
                            onClick={() => {
                                window.location.href = 'http://localhost:3001/auth/google/start?mode=login';
                            }}
                        >
                            Link
                        </button>
                    )}
                </div>
            </div>

            <div style={profileVisibilityStyle}>
                <div style={sectionTitleStyle}>Profile Visibility</div>
                <button style={isProfilePublic ? unlinkButtonStyle : linkButtonStyle} onClick={handleToggleVisibility}>
                    {isProfilePublic ? 'Make Private' : 'Make Public'}
                </button>
            </div>
        </div>
    );
};

export default Settings;
