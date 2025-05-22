type FilterLayoutProps<T extends string> = {
    label: string;
    options: T[];
    selected: T;
    onSelect: (option: T) => void;
};

function FilterLayout<T extends string>({label, options, selected, onSelect}: FilterLayoutProps<T>) {
    return (
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap'}}>
            <span style={{fontWeight: 550, color: '#031A6B'}}>{label}:</span>
            {options.map(option => (
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
}

export default FilterLayout;
