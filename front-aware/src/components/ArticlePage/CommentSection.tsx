import React, {useState} from 'react';
import {FaUser, FaRegComment, FaPaperPlane} from 'react-icons/fa';

interface Comment {
    text: string;
    date: string;
    time?: string;
    isAnonymous: boolean;
    replies: Comment[];
}

const CommentItem: React.FC<{
    comment: Comment;
    onUpdate: (updated: Comment) => void;
}> = ({comment, onUpdate}) => {
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyText, setReplyText] = useState('');

    const handleReplySubmit = () => {
        if (!replyText.trim()) return;
        const now = new Date();
        const newReply: Comment = {
            text: replyText,
            date: now.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}),
            time: now.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'}),
            isAnonymous: true,
            replies: []
        };
        const updatedReplies = [...(comment.replies || []), newReply];
        onUpdate({...comment, replies: updatedReplies});
        setReplyText('');
        setShowReplyBox(false);
    };

    const handleReport = () => {
        alert(`Reported comment: "${comment.text.substring(0, 20)}..."`);
    };

    return (
        <div style={{
            marginBottom: '15px',

            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px',
                    color: '#666'
                }}>
                    <FaUser size={14}/>
                </div>
                <div style={{fontSize: '15px', color: '#031A6B'}}>
                    {comment.isAnonymous ? 'Anonymous' : 'Public'} • {comment.date} • {comment.time}
                </div>
            </div>
            <p style={{marginLeft: '44px', fontSize: '15px', lineHeight: '1.6', color: '#333'}}>
                {comment.text}
            </p>
            <div style={{marginLeft: '44px', display: 'flex', gap: '15px', marginTop: '8px'}}>
                <button onClick={() => setShowReplyBox(!showReplyBox)} style={btnStyle}>Reply</button>
                <button onClick={handleReport} style={{...btnStyle, color: '#D32F2F'}}>Report</button>
            </div>

            {showReplyBox && (
                <div style={{marginLeft: '44px', marginTop: '10px'}}>
                    <textarea
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        style={{
                            width: '100%',
                            height: '80px',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            resize: 'none'
                        }}
                    />
                    <button
                        onClick={handleReplySubmit}
                        style={{
                            marginTop: '8px',
                            padding: '6px 14px',
                            backgroundColor: '#031A6B',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '14px',
                            cursor: 'pointer'
                        }}
                    >
                        Post Reply
                    </button>
                </div>
            )}

            {comment.replies?.length > 0 && (
                <div style={{marginTop: '15px', marginLeft: '40px'}}>
                    {comment.replies.map((reply, index) => (
                        <CommentItem
                            key={index}
                            comment={reply}
                            onUpdate={(updatedReply) => {
                                const updatedReplies = [...(comment.replies || [])];
                                updatedReplies[index] = updatedReply;
                                onUpdate({...comment, replies: updatedReplies});
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const btnStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#031A6B',
    border: 'none',
    background: 'none',
    cursor: 'pointer'
};

const CommentSection: React.FC = () => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [text, setText] = useState('');
    const [isAnonymous] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        const now = new Date();
        setComments([
            ...comments,
            {
                text,
                date: now.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}),
                time: now.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'}),
                isAnonymous,
                replies: []
            }
        ]);
        setText('');
    };

    const updateCommentAtIndex = (index: number, updatedComment: Comment) => {
        const updated = [...comments];
        updated[index] = updatedComment;
        setComments(updated);
    };

    return (
        <div style={{marginLeft: '20px',marginRight: '20px', marginTop: '10px', padding: '30px 0'}}>
            <h3 style={{
                fontSize: '22px',
                color: '#031A6B',
                marginBottom: '10px',
                paddingBottom: '15px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }}>
                <FaRegComment size={18}/>
                <span>Comments ({comments.length})</span>
            </h3>

            <form onSubmit={handleSubmit} style={{
                marginBottom: '20px',
                backgroundColor: '#f8f9fa',
                padding: '25px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
                <div style={{position: 'relative', width: '100%', height: '150px', marginBottom: '15px'}}>
                    <textarea
                        placeholder="Share your thoughts..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        style={{
                            width: '100%',
                            height: '100%',
                            padding: '15px',
                            paddingRight: '130px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '15px',
                            resize: 'none',
                            backgroundColor: '#fff',
                            boxSizing: 'border-box'
                        }}
                        required
                    />
                    <button
                        type="submit"
                        style={{
                            position: 'absolute',
                            bottom: '10px',
                            right: '10px',
                            padding: '10px 20px',
                            backgroundColor: '#031A6B',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        <FaPaperPlane size={14}/>
                        <span>Post</span>
                    </button>
                </div>
            </form>

            <div>
                {comments.map((comment, index) => (
                    <CommentItem
                        key={index}
                        comment={comment}
                        onUpdate={(updated) => updateCommentAtIndex(index, updated)}
                    />
                ))}
            </div>
        </div>
    );
};

export default CommentSection;
