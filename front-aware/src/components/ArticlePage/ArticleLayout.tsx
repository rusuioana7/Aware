import React from 'react';
import {
    FaBookmark,
    FaDownload,
    FaFlag,
    FaHeadphones,
    FaRegClock,
    FaFileAlt,
    FaShareAlt,
    FaExternalLinkAlt
} from 'react-icons/fa';

interface ArticleProps {
    title: string;
    category: string;
    image?: string;
    content: string;
    author: string;
    publisher: string;
    publishedAt: string;
    publishedTime?: string;
    readingTime?: string;
    commentsCount?: number;
    viewsCount?: string;
}

const buttonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    padding: '6px 12px',
    backgroundColor: '#031A6B',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
};

const Article: React.FC<ArticleProps> = ({
                                             title,
                                             category,
                                             image,
                                             content,
                                             author,
                                             publisher,
                                             publishedAt,
                                             publishedTime,
                                             readingTime,
                                             commentsCount,
                                             viewsCount
                                         }) => {
    return (
        <article style={{
            backgroundColor: '#fff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            padding: '25px',
            margin: '20px auto',
            marginLeft: '20px',
            maxWidth: '100%',
            lineHeight: 1.6,
            color: '#222',
            borderRadius: '4px',
            position: 'relative'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '20px',
                fontSize: '14px',
                color: '#555',
                flexWrap: 'wrap'
            }}>
                <button style={buttonStyle}><FaRegClock/> Save For Later</button>
                <button style={buttonStyle}><FaBookmark/> Bookmark</button>
                <button style={buttonStyle}><FaExternalLinkAlt/> View Original</button>
                <button style={buttonStyle}><FaDownload/> Download</button>
                <button style={buttonStyle}><FaShareAlt/> Share</button>
                <button style={buttonStyle}><FaFileAlt/> Summarize</button>
                <button style={buttonStyle}><FaHeadphones/> Listen</button>
                <button style={buttonStyle}><FaFlag/> Report</button>


            </div>

            <div style={{
                textTransform: 'uppercase',
                fontSize: '14px',
                color: '#031A6B',
                fontWeight: 'bold',
                letterSpacing: '1px',
                marginBottom: '8px'
            }}>
                {category}
            </div>

            <h1 style={{
                fontSize: '28px',
                color: '#031A6B',
                margin: '0 0 15px 0',
                fontWeight: 'bold',
                lineHeight: 1.3,
                borderBottom: '1px solid #eee',
                paddingBottom: '15px'
            }}>{title}</h1>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '14px',
                color: '#666',
                marginBottom: '20px',
                flexWrap: 'wrap',
                textAlign: 'center'
            }}>
                <div style={{flex: 1, textAlign: 'left', minWidth: '33%'}}>
                    <span style={{fontWeight: 'bold'}}>By {author}</span> | {publisher}
                </div>

                <div style={{flex: 1, minWidth: '33%'}}>
                    {publishedAt}
                    {publishedTime && ` • ${publishedTime}`}
                    {readingTime && ` • ${readingTime}`}
                </div>

                <div style={{
                    flex: 1,
                    textAlign: 'right',
                    minWidth: '33%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '15px'
                }}>
                    {viewsCount && (
                        <span><strong>{viewsCount}</strong> views</span>
                    )}
                    {commentsCount && (
                        <span><strong>{commentsCount}</strong> comments</span>
                    )}
                </div>
            </div>

            {image && (
                <div style={{
                    marginBottom: '25px',
                    position: 'relative',
                    width: '80%',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>
                    <img
                        src={image}
                        alt={title}
                        style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '2px',
                            display: 'block'
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '8px',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        padding: '2px 6px',
                        fontSize: '12px',
                        borderRadius: '2px'
                    }}>
                        {publisher}
                    </div>
                </div>
            )}

            <div style={{
                fontSize: '17px',
                textAlign: 'left',
                marginBottom: '20px'
            }}>
                {content.split('\n').map((paragraph, i) => (
                    <p key={i} style={{
                        marginBottom: '15px',
                        textAlign: 'justify'
                    }}>
                        {paragraph}
                    </p>
                ))}
            </div>

        </article>
    );
};


export default Article;
