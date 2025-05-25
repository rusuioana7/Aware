import React, {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Folder from '../components/BookmarksPage/Folder';
import type {Folder as FolderType} from '../components/BookmarksPage/BookmarksMenu';
import BookmarksMenu from '../components/BookmarksPage/BookmarksMenu';
import SaveForLater from '../components/BookmarksPage/SaveForLater';
import NewFolder from '../components/BookmarksPage/NewFolder';

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

    const handleAddFolderClick = () => {
        setParentIdForNew(null);
        setShowModal(true);
    };

    const handleAddSubfolder = (parentId: string) => {
        setParentIdForNew(parentId);
        setShowModal(true);
    };

    const addFolder = (folders: FolderType[], newFolder: FolderType, parentId: string): FolderType[] => {
        return folders.map(folder => {
            if (folder.id === parentId) {
                return {
                    ...folder,
                    children: [...(folder.children || []), newFolder]
                };
            }
            if (folder.children) {
                return {
                    ...folder,
                    children: addFolder(folder.children, newFolder, parentId)
                };
            }
            return folder;
        });
    };

    const removeFolder = (folders: FolderType[], idToRemove: string): FolderType[] => {
        return folders
            .filter(folder => folder.id !== idToRemove)
            .map(folder => {
                if (folder.children) {
                    return {
                        ...folder,
                        children: removeFolder(folder.children, idToRemove)
                    };
                }
                return folder;
            });
    };

    const togglePinned = (folders: FolderType[], idToToggle: string): FolderType[] => {
        return folders.map(folder => {
            if (folder.id === idToToggle) {
                return {
                    ...folder,
                    pinned: !folder.pinned,
                };
            }
            if (folder.children) {
                return {
                    ...folder,
                    children: togglePinned(folder.children, idToToggle),
                };
            }
            return folder;
        });
    };

    const createFolder = (name: string, color: string) => {
        const id = name.toLowerCase().replace(/\s+/g, '-');
        const newFolder: FolderType = {id, name, color};

        if (parentIdForNew) {
            setFolders(prev => addFolder(prev, newFolder, parentIdForNew));
        } else {
            setFolders(prev => [...prev, newFolder]);
        }

        setShowModal(false);
        setParentIdForNew(null);
        navigate(`/bookmarks/${id}`);
    };

    const selectFolder = (id: string) => {
        if (id === 'save-for-later') {
            navigate('/bookmarks/save-for-later');
        } else {
            navigate(`/bookmarks/${id}`);
        }
    };

    const handleRemoveFolder = (id: string) => {
        setFolders(prev => removeFolder(prev, id));
        if (folderName === id) {
            navigate('/bookmarks/save-for-later');
        }
    };

    const handleTogglePinned = (id: string) => {
        setFolders(prev => togglePinned(prev, id));
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
                {selectedFolderId === 'save-for-later' && <SaveForLater/>}
                {selectedFolderId !== 'save-for-later' && <Folder folderId={selectedFolderId}/>}
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
