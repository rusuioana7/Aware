import React, { useState } from 'react';

type Props = {
    onCreate: (name: string, color: string, parentId?: string) => void;
    onClose: () => void;
    parentId?: string;
};

const NewFolder: React.FC<Props> = ({ onCreate, onClose, parentId }) => {
    const [name, setName] = useState('');
    const [color, setColor] = useState('#4D96FF');

    const handleCreate = () => {
        if (!name.trim()) {
            alert('Please enter a folder name.');
            return;
        }
        onCreate(name.trim(), color, parentId);
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10000,
            }}
        >
            <div
                style={{
                    backgroundColor: '#fff',
                    padding: 20,
                    borderRadius: 8,
                    width: 300,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <h2>{parentId ? 'Create Subdirectory' : 'Create New Directory'}</h2>

                <label>
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: '90%', padding: '6px 8px', marginTop: 6, fontSize: 16 }}
                        autoFocus
                    />
                </label>

                <label style={{ marginTop: 10 }}>
                    Choose Color:
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        style={{ marginLeft: 10, width: 30, height: 30, marginTop: '5px', cursor: 'pointer' }}
                    />
                </label>

                <div
                    style={{
                        marginTop: 20,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 10,
                    }}
                >
                    <button
                        onClick={handleCreate}
                        style={{
                            backgroundColor: '#009FFD',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 14px',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontWeight: 'bold',
                        }}
                    >
                        Create
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            backgroundColor: '#ccc',
                            border: 'none',
                            padding: '8px 14px',
                            borderRadius: 4,
                            cursor: 'pointer',
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewFolder;
