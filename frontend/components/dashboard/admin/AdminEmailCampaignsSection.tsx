
import React, { useState } from 'react';
import InputField from '../../shared/InputField';

interface Campaign {
    id: number;
    name: string;
    status: 'Sent' | 'Draft' | 'Active';
    recipients: number;
    openRate: string;
}

const initialCampaigns: Campaign[] = [
    { id: 1, name: "Summer Sale 2024", status: "Sent", recipients: 1250, openRate: "22.5%" },
    { id: 2, name: "Welcome Series - New Subscribers", status: "Active", recipients: 0, openRate: "N/A (Automated)" },
    { id: 3, name: "Diwali Collection Launch", status: "Draft", recipients: 0, openRate: "N/A" },
];

const AdminEmailCampaignsSection: React.FC = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
    const [isCreating, setIsCreating] = useState(false);
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');

    const handleSendCampaign = (e: React.FormEvent) => {
        e.preventDefault();
        const newCampaign: Campaign = {
            id: Date.now(),
            name: subject,
            status: 'Sent',
            recipients: Math.floor(Math.random() * 2000) + 500, // mock recipients
            openRate: `${(Math.random() * 20 + 10).toFixed(1)}%` // mock open rate
        };
        setCampaigns(prev => [newCampaign, ...prev]);
        alert(`Sending Campaign:
        Subject: ${subject}
        (Simulated)`);
        setSubject('');
        setContent('');
        setIsCreating(false);
    }
  return (
    <div className="bg-admin-light-card dark:bg-admin-dark-card p-6 md:p-8 rounded-2xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
            <h1 className="text-2xl font-bold text-admin-light-text dark:text-admin-dark-text">Email Campaigns</h1>
            <p className="mt-2 text-admin-light-text-secondary dark:text-admin-dark-text-secondary">
                Manage and track your email marketing efforts.
            </p>
        </div>
        <button onClick={() => setIsCreating(!isCreating)} className="bg-admin-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-admin-accent-hover flex items-center self-start sm:self-center">
            {isCreating ? 'Cancel' : 'Create Campaign'}
        </button>
      </div>
      

    {isCreating && (
        <form onSubmit={handleSendCampaign} className="mb-6 p-4 border rounded-lg bg-admin-light dark:bg-admin-dark space-y-4">
             <InputField label="Campaign Subject" name="subject" value={subject} onChange={e => setSubject(e.target.value)} required/>
             <div>
                <label className="block text-sm font-medium mb-1">Email Body (HTML supported)</label>
                <textarea value={content} onChange={e => setContent(e.target.value)} rows={8} className="w-full text-sm p-2 border rounded-md dark:bg-admin-dark-card" required></textarea>
             </div>
             <button type="submit" className="bg-admin-accent text-white font-semibold py-2 px-4 rounded-lg">Send Campaign</button>
        </form>
    )}

      <div className="overflow-x-auto border rounded-lg">
           <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Campaign Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Recipients</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Open Rate</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
              </thead>
              <tbody className="bg-white dark:bg-admin-dark-card divide-y divide-gray-200 dark:divide-gray-700">
                 {campaigns.map(campaign => (
                     <tr key={campaign.id}>
                         <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{campaign.name}</td>
                         <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                                campaign.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
                                campaign.status === 'Active' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>{campaign.status}</span>
                         </td>
                         <td className="px-4 py-3 whitespace-nowrap text-sm">{campaign.recipients.toLocaleString()}</td>
                         <td className="px-4 py-3 whitespace-nowrap text-sm">{campaign.openRate}</td>
                         <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                             <button className="text-admin-accent hover:underline">View</button>
                             <button className="text-blue-500 hover:underline">Edit</button>
                         </td>
                     </tr>
                 ))}
              </tbody>
           </table>
      </div>
    </div>
  );
};

export default AdminEmailCampaignsSection;
