import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { SupportTicket, ChatMessage, UserProfile } from '../../../types';
import { API_BASE_URL } from '../../../constants';
import InputField from '../../shared/InputField';
import SendIcon from '../../icons/SendIcon';
import CloseIcon from '../../icons/CloseIcon';
import ChatBubbleIcon from '../../icons/ChatBubbleIcon';

const FloatingChatWidget: React.FC<{
    ticket: SupportTicket;
    onClose: () => void;
    onSave: (ticket: SupportTicket) => void;
}> = ({ ticket, onClose, onSave }) => {
    const [messages, setMessages] = useState<SupportTicket['messages']>(ticket.messages);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        setMessages(ticket.messages);
    }, [ticket.messages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        // Polling for new messages from admin
        const pollInterval = setInterval(async () => {
            try {
                const token = localStorage.getItem('zaina-authToken');
                const { data } = await axios.get(`${API_BASE_URL}/user/support-tickets/${ticket.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (data.messages.length > messages.length) {
                    setMessages(data.messages);
                }
            } catch (error) {
                console.error("Polling error:", error);
            }
        }, 5000); // Poll every 5 seconds

        return () => clearInterval(pollInterval);
    }, [ticket.id, messages.length]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || isSending) return;
        
        setIsSending(true);
        const optimisticMessage = { sender: 'user' as const, text: newMessage, timestamp: new Date().toISOString() };
        
        const updatedTicket = {
            ...ticket,
            messages: [...messages, optimisticMessage],
            lastUpdated: new Date().toISOString(),
        };

        setMessages(updatedTicket.messages);
        setNewMessage('');
        
        try {
            onSave(updatedTicket); 
        } catch (error) {
            console.error("Failed to send message", error);
            setMessages(messages);
            setNewMessage(optimisticMessage.text);
            alert("Could not send message. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 w-80 h-[28rem] bg-white dark:bg-dark-zaina-bg-card rounded-lg shadow-2xl flex flex-col z-50 animate-slide-up-fade">
            <header className="flex items-center justify-between p-3 bg-zaina-primary text-white rounded-t-lg flex-shrink-0">
                <h3 className="font-semibold text-sm truncate pr-2">{ticket.subject}</h3>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20"><CloseIcon className="w-5 h-5"/></button>
            </header>
            <main className="flex-grow p-3 space-y-3 overflow-y-auto bg-gray-50 dark:bg-gray-800/50">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-2 rounded-lg max-w-[85%] text-sm shadow-sm ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-zaina-text-primary dark:text-dark-zaina-text-primary'}`}>
                           <p className="whitespace-pre-wrap">{msg.text}</p>
                           <p className="text-right text-[10px] opacity-70 mt-1">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef}/>
            </main>
            <form onSubmit={handleSendMessage} className="p-2 border-t dark:border-dark-zaina-border-strong flex items-center gap-2 flex-shrink-0">
                <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..." className="w-full p-2 border rounded-full text-sm dark:bg-dark-zaina-bg-card dark:border-dark-zaina-border-strong"/>
                <button type="submit" disabled={isSending} className="p-2 bg-zaina-primary text-white rounded-full disabled:opacity-50">
                    <SendIcon className="w-5 h-5"/>
                </button>
            </form>
             <style>{`
                @keyframes slide-up-fade {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-up-fade { animation: slide-up-fade 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};


const UserSupportSection: React.FC<{
  tickets: SupportTicket[];
  onSave: (ticket: SupportTicket) => void;
  userId: string;
}> = ({ tickets: initialTickets, onSave, userId }) => {
    const [view, setView] = useState<'list' | 'form' | 'review'>('list');
    const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
    const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
    const [formData, setFormData] = useState({ subject: '', details: '', phone: '', email: '' });

    useEffect(() => {
        setTickets(initialTickets);
    }, [initialTickets]);
    
    // Simulating fetching current user's info for the form
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // In a real app this would fetch the current user's profile
                // For now, we mock it.
                setFormData(prev => ({ ...prev, phone: '123-456-7890', email: 'customer@example.com'}));
            } catch (error) {
                console.error("Failed to fetch user data for support form", error);
            }
        };
        fetchUserData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCreateTicket = () => {
        const newTicketData: SupportTicket = {
            id: `ticket_${Date.now()}`,
            userId: userId,
            subject: formData.subject,
            status: 'Open',
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            messages: [{
                sender: 'user',
                text: `Phone: ${formData.phone}\nEmail: ${formData.email}\n\nDetails:\n${formData.details}`,
                timestamp: new Date().toISOString()
            }]
        };
        onSave(newTicketData); // This updates the state in App.tsx
        setActiveTicket(newTicketData); // Open the chat widget for the new ticket
        setView('list');
        // Keep phone/email for next ticket, but clear subject/details
        setFormData(prev => ({ ...prev, subject: '', details: ''}));
    };
    
    const getStatusColor = (status: SupportTicket['status']) => {
        switch (status) {
            case 'Open': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50';
            case 'In Progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/50';
            case 'Resolved': return 'bg-green-100 text-green-800 dark:bg-green-800/50';
            case 'Closed': return 'bg-gray-200 text-gray-800 dark:bg-gray-700/50';
            default: return 'bg-gray-100';
        }
    }

    const visibleTickets = tickets.filter(ticket => {
        const ticketDate = new Date(ticket.createdAt);
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        return ticketDate >= ninetyDaysAgo;
    });

    return (
      <div>
        {activeTicket && <FloatingChatWidget ticket={activeTicket} onClose={() => setActiveTicket(null)} onSave={onSave} />}
        
        {view === 'list' && (
            <div>
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold font-heading-playfair text-zaina-text-primary dark:text-dark-zaina-text-primary">My Support Tickets</h2>
                    <button onClick={() => setView('form')} className="bg-zaina-primary text-white font-medium py-2 px-4 rounded-md text-sm">Create New Ticket</button>
                </div>
                <div className="space-y-3">
                    {visibleTickets.map(ticket => (
                        <div key={ticket.id} className="p-3 border dark:border-dark-zaina-border-strong rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-dark-zaina-bg-card gap-3">
                            <div>
                                <p className="font-semibold text-zaina-text-primary dark:text-dark-zaina-text-primary">{ticket.subject}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Last updated: {new Date(ticket.lastUpdated).toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-4 self-end sm:self-center">
                               <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>{ticket.status}</span>
                               <button onClick={() => setActiveTicket(ticket)} className="text-zaina-primary dark:text-dark-zaina-primary hover:underline flex items-center gap-1 text-sm"><ChatBubbleIcon className="w-4 h-4" /> Chat</button>
                            </div>
                        </div>
                    ))}
                    {visibleTickets.length === 0 && <p className="text-center py-6 text-gray-500">You have no support tickets in the last 90 days.</p>}
                </div>
            </div>
        )}

        {view === 'form' && (
            <div>
                <h2 className="text-xl font-semibold mb-4">Raise a Complaint</h2>
                <div className="space-y-4 bg-white dark:bg-dark-zaina-bg-card p-6 rounded-lg">
                    <InputField label="Complaint Subject" name="subject" value={formData.subject} onChange={handleChange} required/>
                    <InputField label="Complaint Details" name="details" as="textarea" rows={5} value={formData.details} onChange={handleChange} required/>
                    <InputField label="Contact Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required/>
                    <InputField label="Contact Email" name="email" type="email" value={formData.email} onChange={handleChange} required/>
                </div>
                 <div className="mt-4 flex gap-3">
                    <button onClick={() => setView('review')} disabled={!formData.subject || !formData.details} className="bg-zaina-primary text-white py-2 px-4 rounded-md disabled:opacity-50">Review Ticket</button>
                    <button onClick={() => setView('list')} className="bg-gray-200 dark:bg-dark-zaina-neutral-medium py-2 px-4 rounded-md">Cancel</button>
                </div>
            </div>
        )}

        {view === 'review' && (
            <div>
                <h2 className="text-xl font-semibold mb-4">Review Your Complaint</h2>
                <div className="p-4 bg-gray-50 dark:bg-dark-zaina-neutral-medium rounded-md space-y-2 border dark:border-dark-zaina-border-strong">
                    <p><strong>Subject:</strong> {formData.subject}</p>
                    <p><strong>Details:</strong> <span className="whitespace-pre-wrap">{formData.details}</span></p>
                    <p><strong>Phone:</strong> {formData.phone}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                </div>
                 <div className="mt-4 flex gap-3">
                    <button onClick={handleCreateTicket} className="bg-green-500 text-white py-2 px-4 rounded-md">Open Complaint Ticket</button>
                    <button onClick={() => setView('form')} className="bg-gray-200 dark:bg-dark-zaina-neutral-medium py-2 px-4 rounded-md">Back to Edit</button>
                </div>
            </div>
        )}
      </div>
    );
};

export default UserSupportSection;