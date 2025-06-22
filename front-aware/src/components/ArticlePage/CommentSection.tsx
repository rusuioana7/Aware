import React, {useEffect, useState} from 'react';
import {FaUser, FaRegComment, FaPaperPlane, FaTrash, FaReply} from 'react-icons/fa';
import {BASE_URL} from "../../api/config.ts";

interface User {
    id: number;
    name: string | null;
    profilePhoto: string | null;
    isPublic: boolean;
}

interface Comment {
    id: string;
    text: string;
    createdAt: string;
    isAnonymous: boolean;
    parentId: string | null;
    user: User;
    children?: Comment[];
}

interface Props {
    articleId: string;
    currentUser: User;
}

const CommentSection: React.FC<Props> = ({articleId, currentUser}) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [text, setText] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        fetch(`${BASE_URL}/comments/${articleId}`)
            .then(res => res.json())
            .then(flat => {
                const map = new Map<string, Comment>();
                const roots: Comment[] = [];

                flat.forEach((c: Comment) => {
                    map.set(c.id, {...c, children: []});
                });

                map.forEach(c => {
                    if (c.parentId && map.has(c.parentId)) {
                        map.get(c.parentId)!.children!.push(c);
                    } else {
                        roots.push(c);
                    }
                });

                setComments(roots);
            });
    }, [articleId]);

    const postComment = async (text: string, parentId?: string) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('Login required to comment.');
            return null;
        }

        const isAnonymous = !currentUser.isPublic;

        const payload = {
            text,
            isAnonymous,
            parentId
        };

        console.log('[DEBUG] post payload:', payload);
        console.log('[DEBUG] currentUser:', currentUser);

        const res = await fetch(`${BASE_URL}/comments/${articleId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const msg = await res.text();
            console.error('Post failed:', res.status, msg);
            alert('Failed to post comment.');
            return null;
        }

        return await res.json();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        const newComment = await postComment(text);
        if (!newComment) return;

        setComments([...comments, {...newComment, children: []}]);
        setText('');
    };

    const handleReplySubmit = async (parentId: string) => {
        if (!replyText.trim()) return;

        const newReply = await postComment(replyText, parentId);
        if (!newReply) return;

        const insertReply = (nodes: Comment[]): Comment[] =>
            nodes.map(c =>
                c.id === parentId
                    ? {...c, children: [...(c.children || []), {...newReply, children: []}]}
                    : {...c, children: insertReply(c.children || [])}
            );

        setComments(insertReply(comments));
        setReplyingTo(null);
        setReplyText('');
    };

    const handleDelete = async (id: string) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('Login required to delete.');
            return;
        }

        const res = await fetch(`${BASE_URL}/comments/${id}`, {
            method: 'DELETE',
            headers: {Authorization: `Bearer ${token}`}
        });

        if (!res.ok) {
            const msg = await res.text();
            console.error('Delete failed:', res.status, msg);
            alert('Could not delete comment.');
            return;
        }

        const removeById = (nodes: Comment[]): Comment[] =>
            nodes
                .filter(c => c.id !== id)
                .map(c => ({...c, children: removeById(c.children || [])}));

        setComments(removeById(comments));
    };

    const renderComment = (comment: Comment, depth: number = 0) => {
        const isOwner = currentUser.id === comment.user.id;
        const displayName =
            comment.isAnonymous || !comment.user.isPublic
                ? 'Anonymous'
                : comment.user.name || 'Unnamed';

        return (
            <div key={comment.id} style={{marginLeft: depth * 20, marginBottom: 16}}>
                <div style={{backgroundColor: '#f1f3f5', padding: 16, borderRadius: 8}}>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: 10}}>
                        {comment.isAnonymous || !comment.user.isPublic || !comment.user.profilePhoto ? (
                            <div style={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                backgroundColor: '#ccc',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 12
                            }}>
                                <FaUser size={14}/>
                            </div>
                        ) : (
                            <img
                                src={comment.user.profilePhoto}
                                alt={displayName}
                                style={{width: 32, height: 32, borderRadius: '50%', marginRight: 12}}
                            />
                        )}
                        <div style={{fontSize: 14, color: '#031A6B'}}>
                            {displayName} • {new Date(comment.createdAt).toLocaleString()}
                        </div>
                    </div>
                    <p style={{fontSize: 15, marginLeft: 44}}>{comment.text}</p>
                    <div style={{marginLeft: 44, display: 'flex', gap: 12, marginTop: 8}}>
                        <button style={btnStyle} onClick={() => setReplyingTo(comment.id)}>
                            <FaReply size={12}/> Reply
                        </button>
                        <button style={btnStyle} onClick={() => alert('Reported')}>
                            Report
                        </button>
                        {isOwner && (
                            <button style={{...btnStyle, color: '#D32F2F'}} onClick={() => handleDelete(comment.id)}>
                                <FaTrash size={12}/> Delete
                            </button>
                        )}
                    </div>
                </div>

                {replyingTo === comment.id && (
                    <div style={{marginTop: 8, marginLeft: 44}}>
            <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                style={{
                    width: '100%',
                    height: 80,
                    padding: 10,
                    fontSize: 14,
                    borderRadius: 4,
                    border: '1px solid #ccc',
                    marginBottom: 6
                }}
            />
                        <button
                            onClick={() => handleReplySubmit(comment.id)}
                            style={{
                                backgroundColor: '#031A6B',
                                color: 'white',
                                padding: '6px 14px',
                                borderRadius: 4,
                                border: 'none',
                                fontSize: 14,
                                cursor: 'pointer'
                            }}
                        >
                            <FaPaperPlane size={12}/> Post Reply
                        </button>
                    </div>
                )}

                {comment.children?.map(child => renderComment(child, depth + 1))}
            </div>
        );
    };

    return (
        <div style={{margin: '30px 20px'}}>
            <h3 style={{fontSize: '22px', color: '#031A6B', marginBottom: '10px'}}>
                <FaRegComment size={18}/> Comments ({comments.length})
            </h3>

            <form onSubmit={handleSubmit} style={{backgroundColor: '#f8f9fa', padding: 20, borderRadius: 8}}>
        <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Share your thoughts..."
            style={{
                width: '100%',
                height: 100,
                padding: 10,
                fontSize: 15,
                borderRadius: 4,
                border: '1px solid #ccc',
                resize: 'none',
                marginBottom: 10
            }}
        />
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <button
                        type="submit"
                        style={{
                            backgroundColor: '#031A6B',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: 4,
                            border: 'none',
                            fontSize: 15,
                            cursor: 'pointer'
                        }}
                    >
                        <FaPaperPlane style={{marginRight: 6}}/>
                        Post
                    </button>
                </div>
            </form>

            <div style={{marginTop: 20}}>
                {comments.map(comment => renderComment(comment))}
            </div>
        </div>
    );
};

const btnStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: '#031A6B',
    cursor: 'pointer',
    fontSize: 13,
    display: 'flex',
    alignItems: 'center',
    gap: 6
};

export default CommentSection;
