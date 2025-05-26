import React, {useState} from 'react';
import {MdOutlineLogout, MdDelete} from 'react-icons/md';
import {CgExport} from 'react-icons/cg';

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

const notificationTitleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
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

const statusStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#555',
    marginRight: '20px',
    minWidth: '80px',
    textAlign: 'center',
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
    const [email, setEmail] = useState('user@example.com');
    const [password, setPassword] = useState('********');
    const [editEmail, setEditEmail] = useState(false);
    const [editPassword, setEditPassword] = useState(false);

    const [emailNotifs, setEmailNotifs] = useState(true);
    const [pushNotifs, setPushNotifs] = useState(true);
    const [weeklySummary, setWeeklySummary] = useState(true);
    const [dailySummary, setDailySummary] = useState(true);
    const [topicAlerts, setTopicAlerts] = useState(true);

    const [linkedAccounts, setLinkedAccounts] = useState({
        google: true,
        facebook: false,
        twitter: true,
    });

    const toggleAccount = (account: keyof typeof linkedAccounts) => {
        setLinkedAccounts((prev) => ({
            ...prev,
            [account]: !prev[account],
        }));
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <div style={sectionTitleStyle}>Account</div>
                <div style={buttonGroupStyle}>
                    <button style={actionButtonStyle}>
                        <MdOutlineLogout size={18}/>
                        Logout
                    </button>
                    <button style={deleteButtonStyle}>
                        <MdDelete size={18}/>
                        Delete Account
                    </button>
                    <button style={actionButtonStyle}>
                        <CgExport size={18}/>
                        Export Data
                    </button>
                </div>
            </div>

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
                    <button
                        onClick={() => setEditEmail(!editEmail)}
                        style={editButtonStyle}
                    >
                        {editEmail ? 'Save' : 'Edit'}
                    </button>
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
                    <button
                        onClick={() => setEditPassword(!editPassword)}
                        style={editButtonStyle}
                    >
                        {editPassword ? 'Save' : 'Edit'}
                    </button>
                </div>
            </div>

            <div style={notificationSectionStyle}>
                <div style={notificationTitleStyle}>Notifications</div>

                <div style={notificationGridStyle}>
                    <div>
                        <div style={notificationRowStyle}>
                            <div>Email Notifications</div>
                            <Toggle
                                checked={emailNotifs}
                                onChange={() => setEmailNotifs(!emailNotifs)}
                            />
                        </div>
                        <div style={{marginLeft: '10px', opacity: emailNotifs ? 1 : 0.5}}>
                            <div style={notificationRowStyle}>
                                <div>Weekly Summary</div>
                                <Toggle
                                    checked={weeklySummary}
                                    onChange={() => setWeeklySummary(!weeklySummary)}
                                    disabled={!emailNotifs}
                                />
                            </div>
                            <div style={notificationRowStyle}>
                                <div>Daily Summary</div>
                                <Toggle
                                    checked={dailySummary}
                                    onChange={() => setDailySummary(!dailySummary)}
                                    disabled={!emailNotifs}
                                />
                            </div>
                            <div style={notificationRowStyle}>
                                <div>Topic Alerts</div>
                                <Toggle
                                    checked={topicAlerts}
                                    onChange={() => setTopicAlerts(!topicAlerts)}
                                    disabled={!emailNotifs}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <div style={notificationRowStyle}>
                            <div>Push Notifications</div>
                            <Toggle
                                checked={pushNotifs}
                                onChange={() => setPushNotifs(!pushNotifs)}
                            />
                        </div>
                        <div style={{marginLeft: '10px', opacity: pushNotifs ? 1 : 0.5}}>
                            <div style={notificationRowStyle}>
                                <div>Weekly Summary</div>
                                <Toggle
                                    checked={weeklySummary}
                                    onChange={() => setWeeklySummary(!weeklySummary)}
                                    disabled={!pushNotifs}
                                />
                            </div>
                            <div style={notificationRowStyle}>
                                <div>Daily Summary</div>
                                <Toggle
                                    checked={dailySummary}
                                    onChange={() => setDailySummary(!dailySummary)}
                                    disabled={!pushNotifs}
                                />
                            </div>
                            <div style={notificationRowStyle}>
                                <div>Topic Alerts</div>
                                <Toggle
                                    checked={topicAlerts}
                                    onChange={() => setTopicAlerts(!topicAlerts)}
                                    disabled={!pushNotifs}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={connectedAccountsContainerStyle}>
                <div style={sectionTitleStyle}>Connected Accounts</div>
                {(['google', 'facebook', 'twitter'] as const).map((acc) => (
                    <div key={acc} style={connectedRowStyle}>
                        <div style={accountNameStyle}>
                            {acc.charAt(0).toUpperCase() + acc.slice(1)}
                        </div>
                        <div style={statusStyle}>
                            {linkedAccounts[acc] ? 'Linked' : 'Not linked'}
                        </div>
                        <button
                            style={linkedAccounts[acc] ? unlinkButtonStyle : linkButtonStyle}
                            onClick={() => toggleAccount(acc)}
                        >
                            {linkedAccounts[acc] ? 'Unlink' : 'Link'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Settings;
