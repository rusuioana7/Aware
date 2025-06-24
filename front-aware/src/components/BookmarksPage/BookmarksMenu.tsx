import React, {type ReactNode} from 'react';
import {FaFolder, FaPlus, FaRegClock, FaStar} from 'react-icons/fa';
import {SlOptionsVertical} from 'react-icons/sl';
import {IoIosArrowForward, IoIosArrowDown} from 'react-icons/io';
import FolderOptions from './FolderOptions';

export type Folder = {
    id: string;
    name: string;
    color?: string;
    children?: Folder[];
    pinned?: boolean;
    icon?: ReactNode;
};

type Props = {
    folders: Folder[];
    selectedFolderId: string;
    onSelectFolder: (id: string) => void;
    onAddFolder: () => void;
    onAddSubfolder: (parentId: string) => void;
    onRemoveFolder: (id: string) => void;
    onTogglePinned: (id: string) => void;
};

const FolderItem: React.FC<{
    folder: Folder;
    selectedFolderId: string;
    onSelectFolder: (id: string) => void;
    onAddSubfolder: (parentId: string) => void;
    onRemoveFolder: (id: string) => void;
    onTogglePinned: (id: string) => void;
    level?: number;
}> = ({
          folder,
          selectedFolderId,
          onSelectFolder,
          onAddSubfolder,
          onRemoveFolder,
          onTogglePinned,
          level = 0,
      }) => {
    const [hovered, setHovered] = React.useState(false);
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const [expanded, setExpanded] = React.useState(true);
    const hasChildren = folder.children && folder.children.length > 0;

    return (
        <div style={{paddingLeft: `${level * 16}px`, position: 'relative'}}>
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 500,
                    fontSize: '20px',
                    cursor: 'pointer',
                    color: selectedFolderId === folder.id ? '#009FFD' : '#000',
                    userSelect: 'none',
                }}
            >
                {hasChildren ? (
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            setExpanded((prev) => !prev);
                        }}
                        style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}
                    >
                        {expanded ? <IoIosArrowDown/> : <IoIosArrowForward/>}
                    </div>
                ) : (
                    <div style={{width: '1em'}}/>
                )}

                <div
                    onClick={() => onSelectFolder(folder.id)}
                    style={{display: 'flex', alignItems: 'center', gap: '6px', flex: 1}}
                >
                    {folder.pinned && <FaStar color="#FFD700"/>}
                    <FaFolder color={folder.color || 'black'}/>
                    {folder.name}
                </div>

                {(hovered || dropdownOpen) && (
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            setDropdownOpen((prev) => !prev);
                        }}
                        style={{cursor: 'pointer', color: '#009FFD', marginLeft: 'auto'}}
                        title="Folder options"
                    >
                        <SlOptionsVertical/>
                    </div>
                )}
            </div>

            {dropdownOpen && (
                <FolderOptions
                    pinned={folder.pinned}
                    onAddSubfolder={() => onAddSubfolder(folder.id)}
                    onRemoveFolder={() => onRemoveFolder(folder.id)}
                    onTogglePinned={() => onTogglePinned(folder.id)}
                    onClose={() => setDropdownOpen(false)}
                />
            )}

            {expanded && hasChildren && (
                <div style={{marginLeft: '16px', borderLeft: '1px solid #ccc', paddingLeft: '12px'}}>
                    {folder.children!.map((child) => (
                        <FolderItem
                            key={child.id}
                            folder={child}
                            selectedFolderId={selectedFolderId}
                            onSelectFolder={onSelectFolder}
                            onAddSubfolder={onAddSubfolder}
                            onRemoveFolder={onRemoveFolder}
                            onTogglePinned={onTogglePinned}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const BookmarksMenu: React.FC<Props> = ({
                                            folders,
                                            selectedFolderId,
                                            onSelectFolder,
                                            onAddFolder,
                                            onAddSubfolder,
                                            onRemoveFolder,
                                            onTogglePinned,
                                        }) => {
    const sortedFolders = [...folders].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return 0;
    });

    return (
        <div
            style={{
                width: '400px',
                borderRight: '1px solid #ccc',
                padding: '20px 15px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                height: '100vh',
                boxSizing: 'border-box',
            }}
        >
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '-15px',
            }}>
                <div style={{fontWeight: 600, fontSize: '22px', color: '#333'}}>Directories</div>
                <div
                    onClick={onAddFolder}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '16px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        color: '#009FFD',
                    }}
                    title="Add new directory"
                >
                    <FaPlus/> <FaFolder color="#009FFD"/>
                </div>
            </div>

            <div style={{height: '1px', backgroundColor: '#ccc', width: '100%', margin: '5px 0'}}/>

            <div style={{overflowY: 'auto', flex: 1}}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '18px'}}>
                    <div
                        onClick={() => onSelectFolder('save-for-later')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            color: selectedFolderId === 'save-for-later' ? '#009FFD' : '#000',
                            fontSize: '20px',
                        }}
                    >
                        <FaRegClock/> Save for Later
                    </div>

                    {sortedFolders
                        .filter(folder => folder.id !== 'save-for-later')
                        .map((folder) => (
                            <FolderItem
                                key={folder.id}
                                folder={folder}
                                selectedFolderId={selectedFolderId}
                                onSelectFolder={onSelectFolder}
                                onAddSubfolder={onAddSubfolder}
                                onRemoveFolder={onRemoveFolder}
                                onTogglePinned={onTogglePinned}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
};

export default BookmarksMenu;
