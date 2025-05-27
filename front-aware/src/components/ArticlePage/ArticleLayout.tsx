import React from 'react';

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
        }}>
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
                fontSize: '14px',
                color: '#666',
                marginBottom: '20px',
                flexWrap: 'wrap'
            }}>
                <div>
                    <span style={{fontWeight: 'bold'}}>By {author}</span> | {publisher}
                </div>
                <div>
                    {publishedAt} {publishedTime && `• ${publishedTime}`} {readingTime && `• ${readingTime}`}
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

            <div style={{
                borderTop: '1px solid #eee',
                paddingTop: '15px',
                fontSize: '14px',
                color: '#666',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                {commentsCount && (
                    <div>
                        <span style={{fontWeight: 'bold'}}>{commentsCount}</span> comments
                    </div>
                )}
                {viewsCount && (
                    <div>
                        <span style={{fontWeight: 'bold'}}>{viewsCount}</span> views
                    </div>
                )}
            </div>
        </article>
    );
};

export default Article;