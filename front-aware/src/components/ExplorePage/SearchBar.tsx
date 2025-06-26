import React from 'react';

type SearchBarProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearch: () => void;
    placeholder?: string;
};

const SearchBar: React.FC<SearchBarProps> = ({
                                                 value,
                                                 onChange,
                                                 onSearch,
                                                 placeholder = 'Search...'
                                             }) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <div style={{display: 'flex', width: '70%'}}>
            <input
                type="text"
                value={value}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                style={{
                    flex: 1,
                    padding: '10px 14px',
                    fontSize: '16px',
                    border: '1px solid #ccc',
                    borderTopLeftRadius: '8px',
                    borderBottomLeftRadius: '8px',
                    outline: 'none',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}
            />
            <button
                onClick={onSearch}
                style={{
                    padding: '10px 16px',
                    fontSize: '16px',
                    backgroundColor: '#031A6B',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    borderTopRightRadius: '8px',
                    borderBottomRightRadius: '8px',
                }}
            >
                Search
            </button>
        </div>
    );
};

export default SearchBar;
