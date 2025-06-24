import React, {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Folder from '../components/BookmarksPage/Folder';
import type {Folder as FolderType} from '../components/BookmarksPage/BookmarksMenu';
import BookmarksMenu from '../components/BookmarksPage/BookmarksMenu';
import SaveForLater from '../components/BookmarksPage/SaveForLater';
import NewFolder from '../components/BookmarksPage/NewFolder';
import {BASE_URL} from '../api/config';
import {FaRegClock} from 'react-icons/fa';

const BookmarksPage: React.FC = () => {
    const [folders, setFolders] = useState<FolderType[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [parentIdForNew, setParentIdForNew] = useState<string | null>(null);

    const navigate = useNavigate();
    const {folderName} = useParams<{ folderName?: string }>();

    useEffect(() => {
        if (!folderName) {
            navigate('/bookmarks/save-for-later', {replace: true});
        }
    }, [folderName, navigate]);

    useEffect(() => {
        const fetchFolders = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            try {
                const res = await fetch(`${BASE_URL}/bookmarks`, {
                    headers: {Authorization: `Bearer ${token}`},
                });
                const data = await res.json();

                interface RawFolder {
                    id: string;
                    name: string;
                    color?: string | null;
                    starred: boolean;
                    children?: RawFolder[];
                }

                const recursiveTransform = (nodes: RawFolder[]): FolderType[] => {
                    return nodes.reduce<FolderType[]>((acc, n) => {
                        if (n.name.trim().toLowerCase() === 'save for later') {
                            return acc;
                        }

                        acc.push({
                            id: n.id,
                            name: n.name,
                            color: n.color || undefined,
                            pinned: n.starred,
                            children: n.children ? recursiveTransform(n.children) : [],
                        });
                        return acc;
                    }, []);
                };

                const foldersFromBackend = recursiveTransform(data);

                const saveForLater: FolderType = {
                    id: 'save-for-later',
                    name: 'Save for Later',
                    color: undefined,
                    pinned: false,
                    icon: <FaRegClock/>,
                    children: [],
                };

                setFolders([saveForLater, ...foldersFromBackend]);
            } catch (err) {
                console.error('Failed to fetch folders:', err);
            }
        };

        fetchFolders();
    }, []);


    const handleAddFolderClick = () => {
        setParentIdForNew(null);
        setShowModal(true);
    };

    const handleAddSubfolder = (parentId: string) => {
        setParentIdForNew(parentId);
        setShowModal(true);
    };

    const addFolder = (folders: FolderType[], newFolder: FolderType, parentId: string): FolderType[] =>
        folders.map(folder => {
            if (folder.id === parentId) {
                return {...folder, children: [...(folder.children || []), newFolder]};
            }
            if (folder.children) {
                return {...folder, children: addFolder(folder.children, newFolder, parentId)};
            }
            return folder;
        });

    const removeFolder = (folders: FolderType[], idToRemove: string): FolderType[] =>
        folders
            .filter(folder => folder.id !== idToRemove)
            .map(folder =>
                folder.children
                    ? {...folder, children: removeFolder(folder.children, idToRemove)}
                    : folder
            );

    const togglePinned = (folders: FolderType[], idToToggle: string): FolderType[] =>
        folders.map(folder => {
            if (folder.id === idToToggle) return {...folder, pinned: !folder.pinned};
            if (folder.children) return {...folder, children: togglePinned(folder.children, idToToggle)};
            return folder;
        });

    const createFolder = async (name: string, color: string) => {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        try {
            const res = await fetch(`${BASE_URL}/bookmarks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name,
                    color,
                    starred: false,
                    parentId: parentIdForNew,
                }),
            });
            const folder = await res.json();
            const newFolder: FolderType = {
                id: folder.id,
                name: folder.name,
                color: folder.color,
                pinned: folder.starred,
                children: [],
            };
            if (parentIdForNew) {
                setFolders(prev => addFolder(prev, newFolder, parentIdForNew));
            } else {
                setFolders(prev => [...prev, newFolder]);
            }
            setShowModal(false);
            setParentIdForNew(null);
            navigate(`/bookmarks/${folder.id}`);
        } catch (err) {
            console.error('Failed to create folder:', err);
        }
    };

    const selectFolder = (id: string) => {
        navigate(`/bookmarks/${id}`);
    };

    const handleRemoveFolder = async (id: string) => {
        const token = localStorage.getItem('authToken');
        try {
            await fetch(`${BASE_URL}/bookmarks/${id}`, {
                method: 'DELETE',
                headers: {Authorization: `Bearer ${token}`},
            });
            setFolders(prev => removeFolder(prev, id));
            if (folderName === id) navigate('/bookmarks/save-for-later');
        } catch (err) {
            console.error('Failed to remove folder:', err);
        }
    };

    const handleTogglePinned = async (id: string) => {
        const token = localStorage.getItem('authToken');
        try {
            await fetch(`${BASE_URL}/bookmarks/${id}/toggle-star`, {
                method: 'PATCH',
                headers: {Authorization: `Bearer ${token}`},
            });
            setFolders(prev => togglePinned(prev, id));
        } catch (err) {
            console.error('Failed to toggle pinned:', err);
        }
    };

    const selectedFolderId = folderName || 'save-for-later';

    return (
        <div style={{display: 'flex'}}>
            <BookmarksMenu
                folders={folders}
                selectedFolderId={selectedFolderId}
                onSelectFolder={selectFolder}
                onAddFolder={handleAddFolderClick}
                onAddSubfolder={handleAddSubfolder}
                onRemoveFolder={handleRemoveFolder}
                onTogglePinned={handleTogglePinned}
            />

            <div style={{padding: '20px'}}>
                {selectedFolderId === 'save-for-later' ? (
                    <SaveForLater/>
                ) : (
                    <Folder folderId={selectedFolderId}/>
                )}
            </div>

            {showModal && (
                <NewFolder
                    onCreate={createFolder}
                    onClose={() => {
                        setShowModal(false);
                        setParentIdForNew(null);
                    }}
                />
            )}
        </div>
    );
};

export default BookmarksPage;
