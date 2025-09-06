


import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ChatSession, ChatMessage } from '../../../types';
import { API_BASE_URL } from '../../../constants';
import PaperclipIcon from '../../icons/PaperclipIcon';
import SendIcon from '../../icons/SendIcon';

interface AdminChatLogsSectionProps {}

const AdminChatLogsSection: React.FC<AdminChatLogsSectionProps> = () => {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);


    const fetchSessions = async () => {
        try {
            const token = localStorage.getItem('zaina-authToken');
            const response = await axios.get(`${API_BASE_URL}/admin/chats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSessions(response.data);
            if (response.data.length > 0 && !selectedSession) {
                // Automatically select the first session if none is selected
                handleSelectSession(response.data[0]);
            }
        } catch (error) {
            console.error("Failed to fetch chat sessions:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchSessions();
        const interval = setInterval(fetchSessions, 10000); // Poll for new sessions every 10 seconds
        return () => clearInterval(interval);
    }, []);
    
    useEffect(() => {
        if (selectedSession) {
            const interval = setInterval(() => handleSelectSession(selectedSession, true), 5000); // Poll for new messages every 5 seconds
            return () => clearInterval(interval);
        }
    }, [selectedSession]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSelectSession = async (session: ChatSession, isPolling = false) => {
        if (!isPolling) {
            setIsLoading(true);
        }
        setSelectedSession(session);
        try {
            const token = localStorage.getItem('zaina-authToken');
            const response = await axios.get(`${API_BASE_URL}/admin/chats/${session.id}/messages`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(response.data);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        } finally {
             if (!isPolling) {
                setIsLoading(false);
             }
        }
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim() || !selectedSession || isSending) return;

        setIsSending(true);
        const text = newMessage;
        setNewMessage('');
        
        try {
            const token = localStorage.getItem('zaina-authToken');
            await axios.post(`${API_BASE_URL}/admin/chats/${selectedSession.id}/messages`, 
                { text },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await handleSelectSession(selectedSession, true);
        } catch (error) {
            console.error("Failed to send message:", error);
            setNewMessage(text); // Restore on failure
        } finally {
            setIsSending(false);
        }
    };
    
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!selectedSession) return;
        const file = e.target.files?.[0];
        if (!file) return;
        
        setIsUploading(true);
        const formData = new FormData();
        formData.append('files', file); // Use 'files' as expected by the media endpoint
        
        try {
            const token = localStorage.getItem('zaina-authToken');
            // Use the generic media upload endpoint
            const { data } = await axios.post(`${API_BASE_URL}/media/upload`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' 
                }
            });

            const uploadedFile = data.files[0];
            const attachmentType = uploadedFile.type.startsWith('image') ? 'image' : 'file';
            
            await axios.post(`${API_BASE_URL}/admin/chats/${selectedSession.id}/messages`, { 
                text: uploadedFile.name,
                attachmentUrl: uploadedFile.url, 
                attachmentType
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            await handleSelectSession(selectedSession, true);
        } catch (error) {
            console.error("Failed to upload file", error);
        } finally {
            setIsUploading(false);
        }
    };


    return (
    <div className="bg-admin-card dark:bg-dark-admin-card p-4 rounded-2xl shadow-lg h-[80vh] flex">
        {/* Chat List */}
        <div className="w-1/3 border-r border-admin-border dark:border-dark-admin-border">
            <h2 className="text-lg font-semibold p-4 text-admin-text-primary">Chat Sessions</h2>
            <div className="overflow-y-auto h-[calc(100%-60px)]">
                {sessions.map(chat => (
                    <button key={chat.id} onClick={() => handleSelectSession(chat)} className={`w-full text-left p-4 border-l-4 ${selectedSession?.id === chat.id ? 'border-admin-accent bg-admin-accent-light dark:bg-dark-admin-accent-light' : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}>
                        <p className="font-semibold text-admin-text-primary">{chat.user?.name}</p>
                        <p className="text-xs text-admin-text-secondary truncate">{chat.messages?.[0]?.text || 'No messages yet.'}</p>
                    </button>
                ))}
            </div>
        </div>
        
        {/* Transcript View */}
        <div className="w-2/3 flex flex-col">
            {selectedSession ? (
                <>
                <div className="p-4 border-b border-admin-border dark:border-dark-admin-border">
                    <h3 className="font-semibold text-admin-text-primary">{selectedSession.user?.name}</h3>
                </div>
                <div className="flex-grow p-4 space-y-3 overflow-y-auto bg-admin-bg dark:bg-dark-admin-bg">
                    {isLoading ? <p>Loading messages...</p> : messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-lg max-w-[80%] text-sm shadow-sm ${msg.sender === 'admin' ? 'bg-admin-accent text-white' : 'bg-white dark:bg-dark-admin-sidebar text-admin-text-primary dark:text-dark-admin-text-primary'}`}>
                               {msg.attachmentUrl ? (
                                    <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer" className="underline flex items-center gap-2">
                                        <PaperclipIcon className="w-4 h-4" /> {msg.text || 'View Attachment'}
                                    </a>
                                ) : (
                                    msg.text
                                )}
                               <div className="text-right text-[10px] opacity-70 mt-1">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="p-2 border-t border-admin-border dark:border-dark-admin-border flex items-center gap-2">
                    <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                       <PaperclipIcon className="w-5 h-5 text-admin-text-secondary" />
                    </button>
                    <input 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="w-full p-3 border border-admin-border dark:border-dark-admin-border rounded-full bg-admin-bg dark:bg-dark-admin-sidebar focus:ring-1 focus:ring-admin-accent outline-none text-sm" 
                        placeholder={isUploading ? "Uploading..." : "Type your reply..."}
                        disabled={isSending || isUploading}
                    />
                    <button type="submit" disabled={isSending || isUploading || !newMessage.trim()} className="p-3 bg-admin-accent text-white rounded-full hover:opacity-90 disabled:opacity-50">
                        <SendIcon className="w-5 h-5" />
                    </button>
                </form>
                </>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-admin-text-secondary">Select a chat to view logs.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default AdminChatLogsSection;