import React from 'react';

interface ImageSectionProps {
    imageSrc: string;
    altText: string;
}

const ImageSection: React.FC<ImageSectionProps> = ({imageSrc, altText}) => {
    return (
        <div className="w-full md:w-1/2 flex justify-center">
            <img src={imageSrc} alt={altText} className="max-w-full h-auto rounded-lg shadow-md"/>
        </div>
    );
};

export default ImageSection;
