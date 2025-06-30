import React from 'react';

const getDateSuffix = (day: number): string => {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
};

const Header: React.FC = () => {
    const today = new Date();
    const weekday = today.toLocaleDateString('en-US', {weekday: 'long'}).toUpperCase();
    const month = today.toLocaleDateString('en-US', {month: 'long'}).toUpperCase();
    const day = today.getDate();
    const suffix = getDateSuffix(day);
    const year = today.getFullYear();
    const formattedDate = `${weekday}\u00A0\u00A0\u00A0${month} ${day}${suffix}, ${year}`;
    return (
        <header className="bg-gray-800 p-6 text-white">
            <div className="flex flex-col items-center">
                <div className="w-full border-t-2 border-gray-400" style={{marginBottom: '4px'}}/>

                <div className="w-full border-t border-gray-400" style={{marginBottom: '10px'}}/>

                <div className="w-full flex items-center relative">
                    <div className="absolute left-4 text-sm font-semibold"
                         style={{marginTop: '-2px', marginBottom: '4px', paddingLeft: '10px'}}>
                        {formattedDate}
                    </div>

                    <h1 className="text-2xl font-bold mb-0 font-sans mx-auto"
                        style={{marginTop: '-2px', marginBottom: '10px'}}>
                        AWARE
                    </h1>
                </div>

                <div className="w-full border-t border-gray-400" style={{marginTop: '-2px', marginBottom: '4px'}}/>

                <div className="w-full border-t-2 border-gray-400 " style={{marginBottom: '2px'}}/>
            </div>
        </header>
    );
};

export default Header;

