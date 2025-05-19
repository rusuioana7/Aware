import React, { useState } from 'react';
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

const dropdownMenuStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: '#2C2C2C',
    padding: '10px 0',
    borderRadius: 6,
    boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
    zIndex: 1000,
};

const dropdownItemStyle: React.CSSProperties = {
    padding: '8px 16px',
    cursor: 'pointer',
    color: '#FFFFFF',
    whiteSpace: 'nowrap',
    fontSize: '16px',
    transition: 'color 0.2s ease',
};

const Menu: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [hoveringHome, setHoveringHome] = useState(false);
    const [hoveredDropdownItem, setHoveredDropdownItem] = useState<string | null>(null);

    const menuItems = [
        { name: 'Explore', path: '/explore' },
        { name: 'Bookmarks', path: '/bookmarks' },
        { name: 'My Profile', path: '/profile' },
    ];

    const homeDropdownItems = [
        { label: 'Feed', id: 'feed' },
        { label: 'Latest News', id: 'latest' },
        { label: 'Saved For Later', id: 'saved' },
        { label: 'Trending', id: 'trending' },
        { label: 'Top Picks For You', id: 'toppicks' },
        { label: 'Threads You Follow', id: 'followedthreads' },
        { label: 'Active Threads', id: 'activethreads' },
    ];

    const goToSection = (sectionId: string) => {
        navigate(`/home#${sectionId}`);
        setHoveringHome(false);
    };

    return (
        <div style={menuContainerStyle}>
            <div
                style={menuItemBaseStyle}
                onMouseEnter={() => setHoveringHome(true)}
                onMouseLeave={() => {
                    setHoveringHome(false);
                    setHoveredDropdownItem(null);
                }}
            >
                <div
                    onClick={() => navigate('/home')}
                    style={{
                        color: hoveringHome || location.pathname === '/home' ? '#009FFD' : '#FFFFFF',
                        padding: '4px 0',
                    }}
                >
                    Home
                </div>
                {hoveringHome && (
                    <div style={dropdownMenuStyle}>
                        {homeDropdownItems.map(item => (
                            <div
                                key={item.id}
                                onClick={() => goToSection(item.id)}
                                onMouseEnter={() => setHoveredDropdownItem(item.id)}
                                onMouseLeave={() => setHoveredDropdownItem(null)}
                                style={{
                                    ...dropdownItemStyle,
                                    color: hoveredDropdownItem === item.id ? '#009FFD' : '#FFFFFF',
                                    backgroundColor: hoveredDropdownItem === item.id ? '#3A3A3A' : 'transparent',
                                }}
                            >
                                {item.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {menuItems.map(item => (
                <div
                    key={item.name}
                    onClick={() => navigate(item.path)}
                    style={{
                        ...menuItemBaseStyle,
                        color: location.pathname === item.path ? '#009FFD' : '#FFFFFF',
                    }}
                    onMouseEnter={e => ((e.target as HTMLDivElement).style.color = '#009FFD')}
                    onMouseLeave={e => {
                        if (location.pathname !== item.path) {
                            (e.target as HTMLDivElement).style.color = '#FFFFFF';
                        }
                    }}
                >
                    {item.name}
                </div>
            ))}
        </div>
    );
};

export default Menu;
