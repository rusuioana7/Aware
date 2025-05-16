import React, {useEffect, useRef, useState} from "react";


interface ZoomIfSmallProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    containerWidth: number;
    containerHeight: number;
}

const ZoomIfSmall: React.FC<ZoomIfSmallProps> = ({containerWidth, containerHeight, style, ...props}) => {
    const [shouldZoom, setShouldZoom] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (imgRef.current) {
            const img = imgRef.current;
            if (img.naturalWidth < containerWidth || img.naturalHeight < containerHeight) {
                setShouldZoom(true);
            } else {
                setShouldZoom(false);
            }
        }
    }, [containerWidth, containerHeight, props.src]);

    return (
        <img
            {...props}
            ref={imgRef}
            style={{
                ...style,
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: shouldZoom ? 'scale(1.1)' : 'none',
                transition: 'transform 0.5s',
            }}
            alt={props.alt}
        />
    );
};

export default ZoomIfSmall;