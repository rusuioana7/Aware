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
    const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
    const [hoveredDropdownIndex, setHoveredDropdownIndex] = useState<number | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number }>({top: 0, left: 0});

    const dropdownItems = [
        {icon: MessageCircle, label: 'Comment'},
        {icon: Download, label: 'Download'},
        {icon: Search, label: 'Show related'},
        {icon: BarChart2, label: 'Show stats'},
    ];

    useEffect(() => {
        if (showDropdown && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + window.scrollY + 5,
                left: rect.right + window.scrollX - 127,
            });
        }
    }, [showDropdown]);

    const containerPositionStyle: React.CSSProperties =
        position === 'top-right'
            ? {top: 8, right: 8, left: 'auto', bottom: 'auto'}
            : {bottom: 0, left: 0, right: 'auto', top: 'auto'};

    const buttonStyle: React.CSSProperties = {
        background: 'none',
        border: 'none',
        padding: '2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
        cursor: 'pointer',
    };

    return (
        <div
            style={{
                position: 'absolute',
                display: 'flex',
                gap: '8px',
                justifyContent: 'flex-end',
                alignItems: 'center',
                padding: '4px 8px',
                backgroundColor: '#fff',
                borderRadius: '6px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                zIndex: 10,
                cursor: 'default',
                ...containerPositionStyle,
                ...customStyle,

            }}
        >
            <button
                aria-label="Save for later"
                style={{
                    ...buttonStyle,
                    backgroundColor: hoveredIcon === 'clock' ? '#f3f4f6' : 'transparent',
                }}
                onMouseEnter={() => setHoveredIcon('clock')}
                onMouseLeave={() => setHoveredIcon(null)}
            >
                <Clock
                    style={{
                        color: hoveredIcon === 'clock' ? iconHoverColor : iconDefaultColor,
                        width: iconSize,
                        height: iconSize,
                    }}
                />
            </button>

            <button
                aria-label="Bookmark"
                style={{
                    ...buttonStyle,
                    backgroundColor: hoveredIcon === 'bookmark' ? '#f3f4f6' : 'transparent',
                }}
                onMouseEnter={() => setHoveredIcon('bookmark')}
                onMouseLeave={() => setHoveredIcon(null)}
            >
                <Bookmark
                    style={{
                        color: hoveredIcon === 'bookmark' ? iconHoverColor : iconDefaultColor,
                        width: iconSize,
                        height: iconSize,
                    }}
                />
            </button>

            <button
                aria-label="Share"
                style={{
                    ...buttonStyle,
                    backgroundColor: hoveredIcon === 'share' ? '#f3f4f6' : 'transparent',
                }}
                onMouseEnter={() => setHoveredIcon('share')}
                onMouseLeave={() => setHoveredIcon(null)}
            >
                <Share
                    style={{
                        color: hoveredIcon === 'share' ? iconHoverColor : iconDefaultColor,
                        width: iconSize,
                        height: iconSize,
                    }}
                />
            </button>

            <div style={{position: 'relative'}}>
                <button
                    ref={buttonRef}
                    aria-label="More options"
                    onClick={() => setShowDropdown(!showDropdown)}
                    style={{background: 'none', border: 'none', padding: '2px', cursor: 'pointer'}}
                    onMouseEnter={() => setHoveredIcon('more')}
                    onMouseLeave={() => setHoveredIcon(null)}
                >
                    <MoreHorizontal
                        style={{
                            color: hoveredIcon === 'more' ? iconHoverColor : iconDefaultColor,
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
                                padding: '6px',
                                zIndex: 1000,
                                minWidth: '120px',
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
                                            padding: '6px',
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
                                        <span style={{
                                            fontSize: '14px',
                                            color: isHovered ? iconHoverColor : iconDefaultColor
                                        }}>
                                            {item.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>,
                        document.body
                    )}
            </div>
        </div>
    );
};

export default ArticleOptions;
