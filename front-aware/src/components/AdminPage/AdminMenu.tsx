import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {BASE_URL} from '../../api/config';

const menuContainerStyle: React.CSSProperties = {
    backgroundColor: '#1C1C1C',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px 0',
    color: '#FFFFFF',
    fontWeight: 500,
    fontSize: '18px',
    gap: '32px',
    position: 'relative',
};

const menuItemBaseStyle: React.CSSProperties = {
    cursor: 'pointer',
    transition: 'color 0.3s ease',
    position: 'relative',
};

const logoutStyle: React.CSSProperties = {
    position: 'absolute',
    right: 16,
    cursor: 'pointer',
    transition: 'color 0.3s ease',
};

const AdminMenu: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        {name: 'Users', path: '/manage-users'},
        {name: 'Articles', path: '/manage-articles'},
        {name: 'Threads', path: '/manage-threads'},
    ];

    const handleLogout = async () => {
        try {
            await fetch(`${BASE_URL}/settings/logout`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
            });
        } catch {
            // ignore
        }
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <div style={menuContainerStyle}>
            {menuItems.map(item => {
                const isActive =
                    item.name === 'Users'
                        ? location.pathname.startsWith('/manage-users')
                        : location.pathname === item.path;

                return (
                    <div
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        style={{
                            ...menuItemBaseStyle,
                            color: isActive ? '#009FFD' : '#FFFFFF',
                        }}
                        onMouseEnter={e =>
                            ((e.currentTarget as HTMLDivElement).style.color = '#009FFD')
                        }
                        onMouseLeave={e => {
                            if (!isActive) {
                                (e.currentTarget as HTMLDivElement).style.color = '#FFFFFF';
                            }
                        }}
                    >
                        {item.name}
                    </div>
                );
            })}

            <div
                style={{...logoutStyle, color: '#FFFFFF'}}
                onClick={handleLogout}
                onMouseEnter={e =>
                    ((e.currentTarget as HTMLDivElement).style.color = '#009FFD')
                }
                onMouseLeave={e =>
                    ((e.currentTarget as HTMLDivElement).style.color = '#FFFFFF')
                }
            >
                Logout
            </div>
        </div>
    );
};

export default AdminMenu;
