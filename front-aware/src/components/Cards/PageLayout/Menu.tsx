import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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

const Menu: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Home', path: '/home' },
        { name: 'Explore', path: '/explore' },
        { name: 'Bookmarks', path: '/bookmarks/save-for-later' },
        { name: 'Profile', path: '/profile' },
    ];

    return (
        <div style={menuContainerStyle}>
            {menuItems.map(item => {
                const isActive =
                    item.name === 'Bookmarks'
                        ? location.pathname.startsWith('/bookmarks')
                        : location.pathname === item.path;

                return (
                    <div
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        style={{
                            ...menuItemBaseStyle,
                            color: isActive ? '#009FFD' : '#FFFFFF',
                        }}
                        onMouseEnter={e => ((e.target as HTMLDivElement).style.color = '#009FFD')}
                        onMouseLeave={e => {
                            if (!isActive) {
                                (e.target as HTMLDivElement).style.color = '#FFFFFF';
                            }
                        }}
                    >
                        {item.name}
                    </div>
                );
            })}
        </div>
    );
};

export default Menu;
