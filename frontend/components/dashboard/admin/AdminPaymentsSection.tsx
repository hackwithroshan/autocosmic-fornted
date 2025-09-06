
import React, { useState, useEffect } from 'react';
import { Order, PaymentGateway } from '../../../types';
import InputField from '../../shared/InputField';
import Modal from '../../shared/Modal';

interface PaymentGatewayEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    gateway: PaymentGateway | null;
    onSave: (gateway: PaymentGateway) => void;
}

const PaymentGatewayEditModal: React.FC<PaymentGatewayEditModalProps> = ({ isOpen, onClose, gateway, onSave }) => {
    const [localGateway, setLocalGateway] = useState<PaymentGateway | null>(gateway);

    useEffect(() => {
        setLocalGateway(gateway);
    }, [gateway]);

    if (!isOpen || !localGateway) return null;

    const handleSettingsChange = (field: string, value: string) => {
        setLocalGateway(prev => {
            if (!prev) return null;
            return {
                ...prev,
                settings: { ...(prev.settings || {}), [field]: value }
            };
        });
    };

    const handleSaveClick = () => {
        if (localGateway) {
            onSave(localGateway);
        }
    };

    const renderGatewaySettings = (g: PaymentGateway) => {
        switch (g.name) {
            case 'Razorpay':
                return (
                    <>
                        <InputField 
                            label="Key ID" 
                            name="apiKey" 
                            value={g.settings.apiKey || ''}
                            onChange={(e) => handleSettingsChange('apiKey', e.target.value)}
                            helperText="Your Razorpay Key ID."
                        />
                        <InputField 
                            label="Key Secret" 
                            name="apiSecret" 
                            type="password"
                            value={g.settings.apiSecret || ''}
                            onChange={(e) => handleSettingsChange('apiSecret', e.target.value)}
                            helperText="Your Razorpay Key Secret."
                        />
                    </>
                );
            case 'PhonePe':
                 return (
                    <>
                        <p className="text-sm text-admin-text-secondary bg-admin-light dark:bg-admin-dark p-3 rounded-lg">
                            PhonePe is routed through Razorpay for web payments. Please ensure your Razorpay keys are correctly configured to accept UPI payments via PhonePe.
                        </p>
                        <InputField 
                            label="Razorpay Key ID (for PhonePe)" 
                            name="apiKey" 
                            value={g.settings.apiKey || ''}
                            onChange={(e) => handleSettingsChange('apiKey', e.target.value)}
                            helperText="Enter your Razorpay Key ID here."
                        />
                        <InputField 
                            label="Razorpay Key Secret (for PhonePe)" 
                            name="apiSecret" 
                            type="password"
                            value={g.settings.apiSecret || ''}
                            onChange={(e) => handleSettingsChange('apiSecret', e.target.value)}
                            helperText="Enter your Razorpay Key Secret here."
                        />
                    </>
                );
            default:
                return <p className="text-sm text-gray-500">No specific configuration for this gateway.</p>;
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Configure ${gateway?.name}`}>
            <div className="space-y-4">
                {renderGatewaySettings(localGateway)}
                <div className="flex justify-end gap-3 pt-3">
                    <button onClick={onClose} className="bg-gray-200 dark:bg-gray-600 text-admin-text dark:text-admin-dark-text font-semibold py-2 px-4 rounded-lg">Cancel</button>
                    <button onClick={handleSaveClick} className="bg-admin-accent text-white font-semibold py-2 px-4 rounded-lg">Save Changes</button>
                </div>
            </div>
        </Modal>
    );
};


interface AdminPaymentsSectionProps {
    orders: Order[];
    paymentGateways: PaymentGateway[];
    onSaveGateway: (gateway: PaymentGateway) => Promise<boolean>;
}


const AdminPaymentsSection: React.FC<AdminPaymentsSectionProps> = ({ orders, paymentGateways, onSaveGateway }) => {
    const [activeTab, setActiveTab] = useState<'gateways' | 'logs'>('gateways');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGateway, setEditingGateway] = useState<PaymentGateway | null>(null);

    const handleToggleGateway = (gateway: PaymentGateway) => {
        onSaveGateway({ ...gateway, enabled: !gateway.enabled });
    };
    
    const handleOpenModal = (gateway: PaymentGateway) => {
        setEditingGateway(gateway);
        setIsModalOpen(true);
    };

    const handleSaveFromModal = async (gatewayToSave: PaymentGateway) => {
        const success = await onSaveGateway(gatewayToSave);
        if (success) {
            setIsModalOpen(false);
            setEditingGateway(null);
        }
    };

    return (
    <div className="bg-admin-light-card dark:bg-admin-dark-card p-6 md:p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-admin-light-text dark:text-admin-dark-text">Payments</h1>
        <p className="mt-2 text-admin-light-text-secondary dark:text-admin-dark-text-secondary mb-6">
            Manage payment gateways and view transaction history.
        </p>

        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="-mb-px flex space-x-6">
                <button onClick={() => setActiveTab('gateways')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'gateways' ? 'border-admin-accent text-admin-accent' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                    Gateways
                </button>
                <button onClick={() => setActiveTab('logs')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'logs' ? 'border-admin-accent text-admin-accent' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                    Transaction Logs
                </button>
            </nav>
        </div>

        {activeTab === 'gateways' && (
             <div className="space-y-4">
                {paymentGateways.map(gateway => (
                    <div key={gateway.id} className="p-4 border dark:border-gray-700 rounded-lg bg-admin-light dark:bg-admin-dark/50">
                        <div className="flex items-center justify-between">
                            <p className="font-semibold">{gateway.name}</p>
                            <div className="flex items-center gap-4">
                                <span className={`text-xs font-semibold mr-3 ${gateway.enabled ? 'text-green-500' : 'text-gray-500'}`}>
                                    {gateway.enabled ? 'Enabled' : 'Disabled'}
                                </span>
                                <button onClick={() => handleToggleGateway(gateway)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${gateway.enabled ? 'bg-admin-accent' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${gateway.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                                {(gateway.name === 'Razorpay' || gateway.name === 'PhonePe') && (
                                     <button onClick={() => handleOpenModal(gateway)} className="text-xs text-blue-500 hover:underline">
                                        Configure
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {activeTab === 'logs' && (
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-admin-dark-card divide-y divide-gray-200 dark:divide-gray-700">
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td className="px-4 py-3 text-sm font-medium text-blue-600">#{order.id.slice(-6)}</td>
                                <td className="px-4 py-3 text-sm">{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td className="px-4 py-3 text-sm">{order.customerName}</td>
                                <td className="px-4 py-3 text-sm">₹{order.totalAmount.toFixed(2)}</td>
                                <td className="px-4 py-3 text-sm capitalize">{order.paymentType || 'N/A'}</td>
                                <td className="px-4 py-3 text-sm">
                                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${order.paymentStatus === 'Success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                      {order.paymentStatus || 'Success'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
                 {orders.length === 0 && (
                    <p className="text-center py-6 text-sm text-gray-500">No transactions yet.</p>
                )}
            </div>
        )}
        <PaymentGatewayEditModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            gateway={editingGateway}
            onSave={handleSaveFromModal}
        />
    </div>
  );
};

export default AdminPaymentsSection;
