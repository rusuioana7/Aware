import React, {useEffect, useState} from 'react';
import {
    FaBookmark,
    FaDownload,
    FaFlag,
    FaHeadphones,
    FaRegClock,
    FaFileAlt,
    FaShareAlt,
    FaExternalLinkAlt,
    FaCheck,
} from 'react-icons/fa';
import CredibilityLabel from '../Cards/Tags/CredibilityLabel.tsx';
import {BASE_URL} from '../../api/config.ts';

interface ArticleProps {
    _id: string;
    title: string;
    category: string;
    image?: string;
    content: string;
    author: string;
    publisher: string;
    publishedAt: string;
    publishedTime?: string;
    readingTime?: string;
    originalUrl?: string;
    commentsCount?: number;
    viewsCount?: number;
    credibilityStatus?: 'verified' | 'unknown' | 'suspicious' | 'untrustworthy' | 'under-review';
}

interface FolderResponse {
    id: string;
    name: string;
    articleIds: string[];
    children?: FolderResponse[];
}

const buttonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    padding: '6px 12px',
    backgroundColor: '#031A6B',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    lineHeight: 'normal'
};

const Article: React.FC<ArticleProps> = ({
                                             _id,
                                             title,
                                             image,
                                             content,
                                             author,
                                             publisher,
                                             publishedAt,
                                             publishedTime,
                                             readingTime,
                                             originalUrl,
                                             commentsCount,
                                             viewsCount,
                                             credibilityStatus,
                                         }) => {
    const [savedForLater, setSavedForLater] = useState(false);
    const [saveFolderId, setSaveFolderId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState<string | null>(null);
    const [bookmarkFolders, setBookmarkFolders] = useState<FolderResponse[]>([]);
    const [showBookmarkMenu, setShowBookmarkMenu] = useState(false);


    useEffect(() => {
        const fetchFolders = async () => {
            const token = localStorage.getItem('authToken');
            if (!token || !_id) return;

            try {
                const res = await fetch(`${BASE_URL}/bookmarks`, {
                    headers: {Authorization: `Bearer ${token}`},
                });
                const folders: FolderResponse[] = await res.json();

                const save = folders.find((f) => f.name.toLowerCase() === 'save for later');
                if (save) {
                    setSaveFolderId(save.id);
                    setSavedForLater(save.articleIds.includes(_id));
                }

                const bookmarkOnly = folders
                    .filter((f) => f.name.toLowerCase() !== 'save for later');
                setBookmarkFolders(bookmarkOnly);
            } catch (err) {
                console.error('Error loading folders:', err);
            }
        };

        fetchFolders();
    }, [_id]);

    const handleSaveForLater = async () => {
        const token = localStorage.getItem('authToken');
        if (!token || !saveFolderId || loading) return;

        const method = savedForLater ? 'DELETE' : 'POST';

        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/bookmarks/${saveFolderId}/articles/${_id}`, {
                method,
                headers: {Authorization: `Bearer ${token}`},
            });

            if (res.ok) {
                setSavedForLater(!savedForLater);
                setSnackbar(savedForLater ? 'Removed from Saved' : 'Saved for Later');
            }
        } catch (err) {
            console.error('Error toggling Save for Later:', err);
        } finally {
            setLoading(false);
            setTimeout(() => setSnackbar(null), 3000);
        }
    };

    function updateArticleInFolderTree(
        folders: FolderResponse[],
        targetId: string,
        articleId: string,
        remove: boolean
    ): FolderResponse[] {
        return folders.map(folder => {
            if (folder.id === targetId) {
                return {
                    ...folder,
                    articleIds: remove
                        ? folder.articleIds.filter(id => id !== articleId)
                        : [...folder.articleIds, articleId],
                };
            }

            if (folder.children) {
                return {
                    ...folder,
                    children: updateArticleInFolderTree(folder.children, targetId, articleId, remove),
                };
            }

            return folder;
        });
    }


    const toggleBookmarkInFolder = async (folderId: string, isBookmarked: boolean) => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            const res = await fetch(
                `${BASE_URL}/bookmarks/${folderId}/articles/${_id}`,
                {
                    method: isBookmarked ? 'DELETE' : 'POST',
                    headers: {Authorization: `Bearer ${token}`},
                }
            );

            if (res.ok) {
                setBookmarkFolders(prev =>
                    updateArticleInFolderTree(prev, folderId, _id, isBookmarked)
                );
            }
        } catch (err) {
            console.error('Error bookmarking:', err);
        }
    };

    const renderFolderTree = (folders: FolderResponse[], level = 0) =>
        folders.map((folder) => {
            const isBookmarked = folder.articleIds.includes(_id);
            return (
                <div key={folder.id} style={{paddingLeft: `${level * 12}px`}}>
                    <li
                        onClick={() => toggleBookmarkInFolder(folder.id, isBookmarked)}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '6px 8px',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            backgroundColor: isBookmarked ? '#F0F8FF' : 'transparent',
                            marginBottom: '4px',
                        }}
                    >
                        {folder.name}
                        {isBookmarked && <FaCheck color="green"/>}
                    </li>
                    {folder.children && renderFolderTree(folder.children, level + 1)}
                </div>
            );
        });

    return (
        <article style={{
            backgroundColor: '#fff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            padding: '25px',
            margin: '20px auto',
            marginLeft: '20px',
            marginRight: '20px',
            maxWidth: '100%',
            lineHeight: 1.6,
            color: '#222',
            borderRadius: '4px',
            position: 'relative'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '20px',
                fontSize: '14px',
                color: '#555',
                flexWrap: 'wrap'
            }}>
                <button
                    style={{...buttonStyle, opacity: loading ? 0.6 : 1}}
                    onClick={handleSaveForLater}
                    disabled={loading}
                >
                    <FaRegClock/> {savedForLater ? 'Saved for Later' : 'Save for Later'}
                </button>

                <div style={{display: 'flex', alignItems: 'center', position: 'relative'}}>
                    <button
                        style={buttonStyle}
                        onClick={() => setShowBookmarkMenu((prev) => !prev)}
                    >
                        <FaBookmark/> Bookmark
                    </button>

                    {showBookmarkMenu && (
                        <div style={{
                            position: 'absolute',
                            top: '40px',
                            left: 0,
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            borderRadius: '6px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                            padding: '10px',
                            zIndex: 999,
                            minWidth: '220px',
                        }}>
                            <strong style={{fontSize: '14px'}}>Add to Folder</strong>
                            <ul style={{listStyle: 'none', margin: 0, padding: 0, marginTop: '8px'}}>
                                {renderFolderTree(bookmarkFolders)}
                            </ul>
                        </div>
                    )}
                </div>

                <a href={originalUrl} target="_blank" rel="noopener noreferrer" style={buttonStyle}>
                    <FaExternalLinkAlt/> View Original
                </a>
                <button style={buttonStyle}><FaDownload/> Download</button>
                <button style={buttonStyle}><FaShareAlt/> Share</button>
                <button style={buttonStyle}><FaFileAlt/> Summarize</button>
                <button style={buttonStyle}><FaHeadphones/> Listen</button>
                <button style={buttonStyle}><FaFlag/> Report</button>
            </div>

            <h1 style={{
                fontSize: '28px',
                color: '#031A6B',
                margin: '0 0 15px 0',
                fontWeight: 'bold',
                lineHeight: 1.3,
                borderBottom: '1px solid #eee',
                paddingBottom: '15px',
                textAlign: 'center'
            }}>{title}</h1>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '14px',
                color: '#666',
                marginBottom: '20px',
                flexWrap: 'wrap',
                textAlign: 'center'
            }}>
                <div style={{flex: 1, textAlign: 'left', minWidth: '33%'}}>
                    <span style={{fontWeight: 'bold'}}>By {author}</span> | {publisher}
                </div>
                <div style={{flex: 1, minWidth: '33%'}}>
                    {publishedAt}
                    {publishedTime && ` • ${publishedTime}`}
                    {readingTime && ` • ${readingTime}`}
                </div>
                <div style={{flex: 1, textAlign: 'right', minWidth: '33%'}}>
                    {credibilityStatus && <CredibilityLabel status={credibilityStatus}/>}
                </div>
            </div>

            {image && (
                <div style={{
                    marginBottom: '25px',
                    position: 'relative',
                    width: '80%',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>
                    <img
                        src={image}
                        alt={title}
                        style={{width: '100%', height: 'auto', borderRadius: '2px'}}
                    />
                    <div style={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '8px',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        padding: '2px 6px',
                        fontSize: '12px',
                        borderRadius: '2px'
                    }}>
                        {publisher}
                    </div>
                </div>
            )}

            <div style={{fontSize: '17px', textAlign: 'left', marginBottom: '20px'}}>
                {content.split('\n').map((paragraph, i) => (
                    <p key={i} style={{marginBottom: '15px', textAlign: 'justify'}}>{paragraph}</p>
                ))}
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                fontSize: '14px',
                color: '#666',
                borderTop: '1px solid #eee',
                paddingTop: '10px',
                marginTop: '30px',
                gap: '20px'
            }}>
                {typeof viewsCount === 'number' && (
                    <span><strong>{viewsCount}</strong> views</span>
                )}
                {typeof commentsCount === 'number' && (
                    <span><strong>{commentsCount}</strong> comments</span>
                )}
            </div>

            {snackbar && (
                <div style={{
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
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                }}>
                    {snackbar}
                </div>
            )}
        </article>
    );
};

export default Article;
