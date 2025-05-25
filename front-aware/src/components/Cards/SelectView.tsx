import React from 'react';

type ViewOption = 'All' | 'Articles' | 'Threads';

type Props = {
    options: ViewOption[];
    selected: ViewOption;
    onSelect: (option: ViewOption) => void;
};

const SelectView: React.FC<Props> = ({options, selected, onSelect}) => {
    return (
        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
            <span style={{fontWeight: 500, color: '#031A6B'}}>View:</span>
            {options.map((option) => (
                <button
                    key={option}
                    onClick={() => onSelect(option)}
                    style={{
                        border: '1px solid #031A6B',
                        backgroundColor: selected === option ? '#031A6B' : 'transparent',
                        color: selected === option ? 'white' : '#031A6B',
                        borderRadius: 25,
                        padding: '6px 16px',
                        fontSize: 14,
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                    }}
                >
                    {option}
                </button>
            ))}
        </div>
    );
};

export default SelectView;
