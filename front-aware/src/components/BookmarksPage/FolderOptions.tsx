import React, {useEffect, useRef} from 'react';
import {FaPlus, FaStar} from 'react-icons/fa';
import {FaTrashCan} from 'react-icons/fa6';

type Props = {
    pinned?: boolean;
    onAddSubfolder: () => void;
    onRemoveFolder: () => void;
    onTogglePinned: () => void;
    onClose: () => void;
};

const FolderOptions: React.FC<Props> = ({
                                            pinned,
                                            onAddSubfolder,
                                            onRemoveFolder,
                                            onTogglePinned,
                                            onClose,
                                        }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const menuItemStyle: React.CSSProperties = {
        padding: '8px 12px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '15px',
    };

    return (
        <div
            ref={dropdownRef}
            style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #ccc',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                borderRadius: '4px',
                zIndex: 1000,
                width: '180px',
                fontSize: '15px',
            }}
        >
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    onTogglePinned();
                    onClose();
                }}
                style={{...menuItemStyle, borderBottom: '1px solid #eee'}}
                onMouseDown={(e) => e.preventDefault()}
            >
                <FaStar/> {pinned ? 'Remove Star' : 'Star'}
            </div>
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    onAddSubfolder();
                    onClose();
                }}
                style={{...menuItemStyle, borderBottom: '1px solid #eee'}}
                onMouseDown={(e) => e.preventDefault()}
            >
                <FaPlus/> Create Subdirectory
            </div>
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFolder();
                    onClose();
                }}
                style={{...menuItemStyle, borderBottom: '1px solid #eee', color: 'red'}}
                onMouseDown={(e) => e.preventDefault()}
            >
                <FaTrashCan/> Remove Directory
            </div>
        </div>
    );
};

export default FolderOptions;
