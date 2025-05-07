import React from 'react';

interface TextSectionProps {
    title: string;
    content: string;
}

const TextSection: React.FC<TextSectionProps> = ({content}) => {
    return (
        <div className="w-full md:w-1/2 flex justify-center">
            <div className="leading-relaxed text-gray-800 text-left max-w-xl flex-wrap">

                <p style={{fontSize: '1rem'}}>
                    {content}
                </p>
            </div>
        </div>
    );
};

export default TextSection;