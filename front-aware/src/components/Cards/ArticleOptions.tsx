import React, {useState, useRef, useEffect} from 'react';
import ReactDOM from 'react-dom';
import {
    Bookmark,
    Clock,
    Share,
    MoreHorizontal,
    MessageCircle,
    Download,
    BarChart2,
    Search,
} from 'lucide-react';

const iconDefaultColor = '#6B7280';
const iconHoverColor = '#009FFD';
const iconSize = 20;

interface ArticleOptionsProps {
    position?: 'bottom-left' | 'top-right';
    customStyle?: React.CSSProperties;
}

const ArticleOptions: React.FC<ArticleOptionsProps> = ({position = 'bottom-left', customStyle}) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [hoveredDropdownIndex, setHoveredDropdownIndex] = useState<number | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number }>({top: 0, left: 0});

    const dropdownItems = [
        {icon: Clock, label: 'Save for later'},
        {icon: Bookmark, label: 'Bookmark'},
        {icon: Share, label: 'Share'},
        {icon: MessageCircle, label: 'Comment'},
        {icon: Download, label: 'Download'},
        {icon: Search, label: 'Show related'},
        {icon: BarChart2, label: 'Show stats'},
    ];

    useEffect(() => {
        if (showDropdown && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const top = rect.bottom + window.scrollY + 2;
            const left = position.includes('right')
                ? rect.right + window.scrollX - 80
                : rect.left + window.scrollX;

            setDropdownPos({top, left});
        }
    }, [showDropdown, position]);


    return (
        <div
            style={{
                position: 'relative',
                display: 'inline-flex',
                ...customStyle,
            }}
        >
            <button
                ref={buttonRef}
                aria-label="More options"
                onClick={() => setShowDropdown((prev) => !prev)}
                style={{
                    background: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '2px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <MoreHorizontal
                    style={{
                        color: '#555555',
                        width: iconSize,
                        height: iconSize,
                    }}
                />
            </button>

            {showDropdown &&
                ReactDOM.createPortal(
                    <div
                        style={{
                            position: 'absolute',
                            top: dropdownPos.top,
                            left: dropdownPos.left,
                            backgroundColor: '#ffffff',
                            border: '1px solid #d1d5db',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            borderRadius: '4px',
                            padding: '6px 0',
                            zIndex: 1000,
                            minWidth: '150px',
                        }}
                        onMouseLeave={() => setShowDropdown(false)}
                    >
                        {dropdownItems.map((item, index) => {
                            const IconComponent = item.icon;
                            const isHovered = hoveredDropdownIndex === index;
                            return (
                                <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 12px',
                                        cursor: 'pointer',
                                        borderRadius: '4px',
                                        backgroundColor: isHovered ? '#f3f4f6' : 'transparent',
                                    }}
                                    onMouseEnter={() => setHoveredDropdownIndex(index)}
                                    onMouseLeave={() => setHoveredDropdownIndex(null)}
                                >
                                    <IconComponent
                                        style={{
                                            color: isHovered ? iconHoverColor : iconDefaultColor,
                                            width: iconSize,
                                            height: iconSize,
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: '14px',
                                            color: isHovered ? iconHoverColor : iconDefaultColor,
                                        }}
                                    >
                                        {item.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>,
                    document.body
                )}
        </div>
    );
};

export default ArticleOptions;
