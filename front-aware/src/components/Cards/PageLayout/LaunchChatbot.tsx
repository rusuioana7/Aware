import React, {useState} from 'react';
import {TbMessageChatbot} from "react-icons/tb";
import ChatbotBox from "./ChatBot.tsx";

const LaunchChatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => {
        setIsOpen(prev => !prev);
    };

    return (
        <>
            <button
                onClick={toggleChat}
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#031A6B',
                    color: '#fff',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    cursor: 'pointer',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                title="Open Chat Assistant"
            >
                <TbMessageChatbot size={28}/>
            </button>

            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '100px',
                        right: '24px',
                        width: '360px',
                        maxHeight: '500px',
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                        zIndex: 9999,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <div style={{padding: '12px 16px', backgroundColor: '#031A6B', color: '#fff', fontWeight: 'bold'}}>
                        ChatBot Assistant
                        <button
                            onClick={toggleChat}
                            style={{
                                float: 'right',
                                background: 'none',
                                border: 'none',
                                color: '#fff',
                                fontSize: '18px',
                                cursor: 'pointer',
                            }}
                        >
                            ✕
                        </button>
                    </div>
                    <ChatbotBox/>
                </div>
            )}
        </>
    );
};

export default LaunchChatbot;
