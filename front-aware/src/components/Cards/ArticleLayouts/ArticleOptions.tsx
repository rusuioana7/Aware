import React, {useState, useRef, useEffect, type JSX} from 'react';
import ReactDOM from 'react-dom';
import {
    Bookmark,
    Clock,
    Share,
    MoreHorizontal,
    MessageCircle,
    Download,
} from 'lucide-react';
import {BASE_URL} from '../../../api/config.ts';
import {Check} from 'lucide-react';

const iconDefaultColor = '#6B7280';
const iconHoverColor = '#009FFD';
const iconSize = 20;

interface Folder {
    id: string;
    name: string;
    articleIds: string[];
    children?: Folder[];
}

interface ArticleOptionsProps {
    articleId: string;
    position?: 'bottom-left' | 'top-right';
    customStyle?: React.CSSProperties;
    commentSectionRef?: React.RefObject<HTMLDivElement>;
}

const ArticleOptions: React.FC<ArticleOptionsProps> = ({
                                                           articleId,
                                                           position = 'bottom-left',
                                                           customStyle,
                                                       }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [hoveredDropdownIndex, setHoveredDropdownIndex] = useState<number | null>(null);
    const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number }>({top: 0, left: 0});
    const [saveLaterFolderId, setSaveLaterFolderId] = useState<string | null>(null);
    const [isSavedForLater, setIsSavedForLater] = useState(false);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [showFolders, setShowFolders] = useState(false);
    const [snackbar, setSnackbar] = useState<string | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const showMessage = (msg: string, duration = 3000) => {
        setSnackbar(msg);
        setTimeout(() => setSnackbar(null), duration);
    };

    const isInFolder = (folder: Folder) => folder.articleIds.includes(articleId);

    const loadFoldersAndSaveStatus = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            const res = await fetch(`${BASE_URL}/bookmarks`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            const data = await res.json();
            const save = data.find((f: Folder) => f.name.toLowerCase() === 'save for later');
            const bookmarkFolders = data.filter((f: Folder) => f.name.toLowerCase() !== 'save for later');

            if (save) {
                setSaveLaterFolderId(save.id);
                setIsSavedForLater(save.articleIds.includes(articleId));
            }
            setFolders(bookmarkFolders);
        } catch (err) {
            console.error('Error loading folders:', err);
        }
    };

    useEffect(() => {
        if (showDropdown) {
            loadFoldersAndSaveStatus();
        }
    }, [showDropdown]);

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

    const toggleSaveForLater = async () => {
        const token = localStorage.getItem('authToken');
        if (!token || !saveLaterFolderId) return;

        const method = isSavedForLater ? 'DELETE' : 'POST';
        try {
            const res = await fetch(
                `${BASE_URL}/bookmarks/${saveLaterFolderId}/articles/${articleId}`,
                {
                    method,
                    headers: {Authorization: `Bearer ${token}`},
                }
            );

            if (res.ok) {
                setIsSavedForLater((prev) => !prev);
                showMessage(isSavedForLater ? 'Removed from Saved' : 'Saved for Later');
            }
        } catch (err) {
            console.error('Error toggling Save for Later:', err);
        }
    };

    const toggleBookmark = async (folderId: string, isBookmarked: boolean) => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            const res = await fetch(
                `${BASE_URL}/bookmarks/${folderId}/articles/${articleId}`,
                {
                    method: isBookmarked ? 'DELETE' : 'POST',
                    headers: {Authorization: `Bearer ${token}`},
                }
            );

            if (res.ok) {
                showMessage(isBookmarked ? 'Removed from folder' : 'Added to folder');
                loadFoldersAndSaveStatus();
            }
        } catch (err) {
            console.error('Bookmark toggle failed:', err);
        }
    };

    const renderFolderList = (folders: Folder[], level = 0): JSX.Element[] =>
        folders.flatMap((folder) => {
            const inFolder = isInFolder(folder);

            return [
                <div
                    key={folder.id}
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(folder.id, inFolder);
                        setShowFolders(false);
                        setShowDropdown(false);
                    }}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '6px 10px',
                        marginBottom: '4px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        backgroundColor: inFolder ? '#F0F8FF' : 'transparent',
                        fontWeight: inFolder ? 500 : 400,
                        paddingLeft: `${12 + level * 12}px`,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E6F7FF')}
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = inFolder ? '#F0F8FF' : 'transparent')
                    }
                >
                    <span>{folder.name}</span>
                    {inFolder && <Check size={16} color="#28a745"/>}
                </div>,
                ...(folder.children ? renderFolderList(folder.children, level + 1) : []),
            ];
        });


    const handleDownload = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            const res = await fetch(`${BASE_URL}/articles/${articleId}/download/pdf`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            if (!res.ok) throw new Error('Download failed');

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `article-${articleId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed:', err);
            showMessage('Download failed');
        }
    };

    const handleShare = async () => {
        try {
            const link = `${window.location.origin}/article/${articleId}`;
            await navigator.clipboard.writeText(link);
            showMessage('Link copied to clipboard');
        } catch (err) {
            console.error('Failed to copy URL:', err);
            showMessage('Failed to copy');
        }
    };

    const handleComment = () => {
        window.location.href = `/article/${articleId}#comments`;
    };

    const dropdownItems = [
        {
            icon: Clock,
            label: isSavedForLater ? 'Remove from Saved' : 'Save for Later',
            action: toggleSaveForLater,
        },
        {
            icon: Bookmark,
            label: 'Bookmark',
            action: async () => {
                await loadFoldersAndSaveStatus();
                setShowFolders(true);
            },
        },
        {
            icon: Share,
            label: 'Share',
            action: handleShare,
        },
        {
            icon: MessageCircle,
            label: 'Comment',
            action: handleComment,
        },
        {
            icon: Download,
            label: 'Download PDF',
            action: handleDownload,
        },
    ];

    return (
        <div style={{position: 'relative', display: 'inline-flex', ...customStyle}}>
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
                <MoreHorizontal style={{color: '#555555', width: iconSize, height: iconSize}}/>
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
                            minWidth: '180px',
                        }}
                        onMouseLeave={() => {
                            setShowDropdown(false);
                            setShowFolders(false);
                        }}
                    >
                        {showFolders ? (
                            <ul style={{listStyle: 'none', margin: 0, padding: '4px 8px'}}>
                                <strong style={{fontSize: '14px', display: 'block', marginBottom: '6px'}}>
                                    Add to Folder
                                </strong>
                                {renderFolderList(folders)}
                            </ul>
                        ) : (
                            dropdownItems.map((item, index) => {
                                const IconComponent = item.icon;
                                const isHovered = hoveredDropdownIndex === index;
                                return (
                                    <div
                                        key={index}
                                        onClick={() => item.action()}
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
                            })
                        )}
                    </div>,
                    document.body
                )}

            {snackbar && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#031A6B',
                        color: 'white',
                        padding: '10px 16px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        zIndex: 1000,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                    }}
                >
                    {snackbar}
                </div>
            )}
        </div>
    );
};

export default ArticleOptions;
