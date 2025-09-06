
import React, { useState } from 'react';
import PlusCircleIcon from '../../icons/PlusCircleIcon';

interface CustomerGroup {
    id: string;
    name: string;
    memberCount: number;
    rules: string; // Text description of rules
}

const initialGroups: CustomerGroup[] = [
    { id: 'grp1', name: 'VIP Customers', memberCount: 12, rules: 'Total spent > $1000' },
    { id: 'grp2', name: 'Repeat Buyers', memberCount: 45, rules: 'Total orders > 3' },
    { id: 'grp3', name: 'New Customers', memberCount: 88, rules: 'Joined in last 30 days' }
];

const AdminCustomerGroupsSection: React.FC = () => {
    const [groups, setGroups] = useState<CustomerGroup[]>(initialGroups);
    
    const handleAction = (action: string, groupName: string) => {
        alert(`${action} for group "${groupName}" (simulated).`);
    };

    return (
        <div className="bg-admin-light-card dark:bg-admin-dark-card p-6 md:p-8 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <div>
                <h1 className="text-2xl font-bold text-admin-light-text dark:text-admin-dark-text">Customer Groups</h1>
                <p className="mt-2 text-admin-light-text-secondary dark:text-admin-dark-text-secondary">
                    Segment customers for targeted marketing, discounts, and insights.
                </p>
            </div>
            <button className="bg-admin-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-admin-accent-hover flex items-center self-start sm:self-center">
                <PlusCircleIcon className="w-5 h-5 mr-2"/> Create Group
            </button>
        </div>
        

        <div className="overflow-x-auto border rounded-lg">
             <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Group Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Members</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rules</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-admin-dark-card divide-y divide-gray-200 dark:divide-gray-700">
                   {groups.map(group => (
                       <tr key={group.id}>
                           <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{group.name}</td>
                           <td className="px-4 py-3 whitespace-nowrap text-sm">{group.memberCount}</td>
                           <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{group.rules}</td>
                           <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                               <button onClick={() => handleAction('Edit', group.name)} className="text-admin-accent hover:underline">Edit</button>
                               <button onClick={() => handleAction('View Members', group.name)} className="text-blue-500 hover:underline">View</button>
                               <button onClick={() => handleAction('Delete', group.name)} className="text-red-500 hover:underline">Delete</button>
                           </td>
                       </tr>
                   ))}
                </tbody>
             </table>
        </div>
        </div>
    );
};

export default AdminCustomerGroupsSection;
