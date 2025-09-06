import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { SupportTicket, ChatMessage } from '../../../types';
import Modal from '../../shared/Modal';
import { API_BASE_URL } from '../../../constants';

interface AdminSupportTicketsSectionProps {
  initialTickets: SupportTicket[];
  onSaveTicket: (ticket: SupportTicket) => void;
  adminName: string;
}

const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
        case 'Open': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50';
        case 'In Progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/50';
        case 'Resolved': return 'bg-green-100 text-green-800 dark:bg-green-800/50';
        case 'Closed': return 'bg-gray-200 text-gray-800 dark:bg-gray-700/50';
        default: return 'bg-gray-100';
    }
}

const AdminTicketChatModal: React.FC<{
    ticket: SupportTicket;
    onClose: () => void;
    onSave: (ticket: SupportTicket) => void;
    adminName: string;
}> = ({ ticket, onClose, onSave, adminName }) => {
    const [currentTicket, setCurrentTicket] = useState(ticket);
    const [replyText, setReplyText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        setCurrentTicket(ticket);
    }, [ticket]);

    // Mark as read when opening and join conversation if needed
    useEffect(() => {
        const initializeChat = async () => {
            if (ticket) {
                let needsUpdate = false;
                let updatedTicketData = { ...ticket };

                if (!ticket.seenByAdmin) {
                    updatedTicketData = { ...updatedTicketData, seenByAdmin: true };
                    needsUpdate = true;
                    try {
                        const token = localStorage.getItem('zaina-authToken');
                        await axios.post(`${API_BASE_URL}/admin/support-tickets/${ticket.id}/read`, {}, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                    } catch (error) {
                        console.error("Failed to mark ticket as read", error);
                    }
                }

                const isAdminJoined = ticket.messages.some(m => m.sender === 'admin');
                if (ticket.status === 'Open' && !isAdminJoined) {
                    const joinMessage = {
                        sender: 'admin' as const,
                        text: `Our support team has joined. You are now connected with ${adminName}.`,
                        timestamp: new Date().toISOString()
                    };
                    updatedTicketData = {
                        ...updatedTicketData,
                        status: 'In Progress' as const,
                        messages: [...updatedTicketData.messages, joinMessage],
                    };
                    needsUpdate = true;
                }

                if (needsUpdate) {
                    onSave(updatedTicketData);
                }
            }
        };
        initializeChat();
    }, [ticket.id]);


    // Polling for new messages
    useEffect(() => {
        if (!ticket) return;
        const pollInterval = setInterval(async () => {
            try {
                const token = localStorage.getItem('zaina-authToken');
                const { data } = await axios.get(`${API_BASE_URL}/admin/support-tickets/${ticket.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (data.messages.length > currentTicket.messages.length) {
                    setCurrentTicket(data);
                }
            } catch (error) {
                console.error("Polling error in admin chat:", error);
            }
        }, 5000);
        return () => clearInterval(pollInterval);
    }, [ticket.id, currentTicket.messages.length]);


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentTicket.messages]);
    

    const handleSendReply = async () => {
        if (!replyText.trim() || isSending) return;
        setIsSending(true);
        
        const newAdminMessage = {
            sender: 'admin' as const,
            text: replyText,
            timestamp: new Date().toISOString()
        };

        const updatedTicket = {
            ...currentTicket,
            messages: [...currentTicket.messages, newAdminMessage],
            lastUpdated: new Date().toISOString(),
            seenByAdmin: true,
        };
        
        onSave(updatedTicket); 
        setCurrentTicket(updatedTicket); // Optimistic update
        setReplyText('');
        setIsSending(false);
    };

    const handleChangeStatus = (newStatus: SupportTicket['status']) => {
        const updatedTicket = { ...currentTicket, status: newStatus, lastUpdated: new Date().toISOString() };
        onSave(updatedTicket);
        setCurrentTicket(updatedTicket);
    };

    return (
        <Modal isOpen={!!ticket} onClose={onClose} title={`Ticket #${ticket.id.slice(-6)}: ${ticket.subject}`} size="lg">
             <div className="flex justify-between items-center mb-4">
                 <p className="text-sm text-gray-500 dark:text-gray-400">From: User ID {ticket.userId.slice(-6)}</p>
                 <select 
                    value={currentTicket.status} 
                    onChange={e => handleChangeStatus(e.target.value as SupportTicket['status'])}
                    className={`text-xs p-1 rounded-md border-gray-300 dark:bg-dark-admin-card ${getStatusColor(currentTicket.status)}`}
                 >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                 </select>
             </div>
             <div className="h-80 overflow-y-auto space-y-3 p-3 bg-gray-100 dark:bg-gray-800/50 rounded-md">
                 {currentTicket.messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                         <div className={`p-2.5 rounded-lg max-w-[80%] text-sm shadow-sm ${msg.sender === 'admin' ? 'bg-admin-accent text-white' : 'bg-white dark:bg-dark-admin-sidebar'}`}>
                             <p className="whitespace-pre-wrap">{msg.text}</p>
                             <p className="text-right text-[10px] opacity-70 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                         </div>
                    </div>
                 ))}
                 <div ref={messagesEndRef} />
             </div>
             <div className="mt-4">
                <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Type your reply..." rows={3} className="w-full text-sm p-2 border rounded-md dark:bg-admin-dark dark:border-dark-admin-border-strong" />
                <button onClick={handleSendReply} disabled={isSending} className="mt-2 bg-admin-accent text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50">
                    {isSending ? 'Sending...' : 'Send Reply'}
                </button>
             </div>
        </Modal>
    );
};

const AdminSupportTicketsSection: React.FC<AdminSupportTicketsSectionProps> = ({ initialTickets, onSaveTicket, adminName }) => {
    const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
    const [viewingTicket, setViewingTicket] = useState<SupportTicket | null>(null);
    const [filter, setFilter] = useState<'All' | 'Open' | 'In Progress' | 'Resolved' | 'Closed'>('All');
    
    useEffect(() => {
        setTickets(initialTickets);
    }, [initialTickets]);

    const filteredTickets = tickets.filter(t => filter === 'All' || t.status === filter);

    const handleSaveFromModal = (updatedTicket: SupportTicket) => {
        onSaveTicket(updatedTicket);
        setViewingTicket(prev => prev ? updatedTicket : null); // Keep modal open with updated state
    };

    return (
        <div className="bg-admin-light-card dark:bg-admin-dark-card p-6 md:p-8 rounded-2xl shadow-lg">
            <h1 className="text-2xl font-bold text-admin-light-text dark:text-admin-dark-text">Support Tickets & Queries</h1>
            <p className="mt-2 text-admin-light-text-secondary dark:text-admin-dark-text-secondary mb-6">
                Respond to and manage customer queries.
            </p>
            
            <div className="mb-4 flex flex-wrap gap-2">
                {(['All', 'Open', 'In Progress', 'Resolved', 'Closed'] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 text-sm rounded-md mr-2 ${filter === f ? 'bg-admin-accent text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>{f}</button>
                ))}
            </div>

             <div className="overflow-x-auto border rounded-lg">
                 <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ticket ID</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">User ID</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-admin-dark-card divide-y divide-gray-200 dark:divide-gray-700">
                       {filteredTickets.map(ticket => (
                           <tr key={ticket.id}>
                               <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                   <div className="flex items-center gap-2">
                                     {!ticket.seenByAdmin && <span className="w-2 h-2 bg-admin-accent rounded-full" title="Unread"></span>}
                                     <span>#{ticket.id.slice(-6)}</span>
                                   </div>
                               </td>
                               <td className="px-4 py-3 whitespace-nowrap text-sm">{ticket.subject}</td>
                               <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{ticket.userId.slice(-6)}</td>
                               <td className="px-4 py-3 whitespace-nowrap text-sm">
                                 <span className={`px-2 py-1 text-xs rounded-full font-semibold ${getStatusColor(ticket.status)}`}>{ticket.status}</span>
                               </td>
                               <td className="px-4 py-3 whitespace-nowrap text-sm">{new Date(ticket.lastUpdated).toLocaleString()}</td>
                               <td className="px-4 py-3 whitespace-nowrap text-sm">
                                   <button onClick={() => setViewingTicket(ticket)} className="text-admin-accent hover:underline">View/Reply</button>
                               </td>
                           </tr>
                       ))}
                       {filteredTickets.length === 0 && (
                           <tr><td colSpan={6} className="text-center p-4 text-gray-500">No tickets found for this filter.</td></tr>
                       )}
                    </tbody>
                 </table>
            </div>
            {viewingTicket && <AdminTicketChatModal ticket={viewingTicket} onClose={() => setViewingTicket(null)} onSave={handleSaveFromModal} adminName={adminName} />}
        </div>
    );
};

export default AdminSupportTicketsSection;