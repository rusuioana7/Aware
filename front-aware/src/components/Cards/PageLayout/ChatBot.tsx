import React, {useState} from 'react';

type Message = {
    sender: 'user' | 'bot';
    text: string;
};

const ChatbotBox: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {sender: 'bot', text: 'Hello! How can I help you today?'}
    ]);
    const [input, setInput] = useState('');

    const sendMessage = () => {
        if (!input.trim()) return;

        const userMessage: Message = {sender: 'user', text: input};
        setMessages(prev => [...prev, userMessage]);

        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                {sender: 'bot', text: `hei "${input}"!`}
            ]);
        }, 800);

        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') sendMessage();
    };

    return (
        <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <div style={{flex: 1, overflowY: 'auto', padding: '12px'}}>
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        style={{
                            marginBottom: '10px',
                            textAlign: msg.sender === 'user' ? 'right' : 'left',
                        }}
                    >
                        <span
                            style={{
                                display: 'inline-block',
                                padding: '10px 14px',
                                backgroundColor: msg.sender === 'user' ? '#031A6B' : '#f1f1f1',
                                color: msg.sender === 'user' ? '#fff' : '#333',
                                borderRadius: '16px',
                                maxWidth: '80%',
                            }}
                        >
                            {msg.text}
                        </span>
                    </div>
                ))}
            </div>
            <div style={{display: 'flex', borderTop: '1px solid #eee', padding: '8px'}}>
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '20px',
                        border: '1px solid #ccc',
                        outline: 'none',
                        fontSize: '14px',
                    }}
                />
                <button
                    onClick={sendMessage}
                    style={{
                        marginLeft: '8px',
                        padding: '10px 14px',
                        borderRadius: '20px',
                        backgroundColor: '#031A6B',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatbotBox;
