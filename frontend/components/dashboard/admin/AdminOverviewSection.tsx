
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PageName, AdminDashboardStats, Order } from '../../../types';
import { API_BASE_URL } from '../../../constants';
import StatCard from '../common/DashboardCard';
import DollarSignIcon from '../../icons/DollarSignIcon';
import ShoppingCartIcon from '../../icons/ShoppingCartIcon';
import PackageIcon from '../../icons/PackageIcon';
import UsersIcon from '../../icons/UsersIcon';
import { PLACEHOLDER_IMAGE_URL } from '../../../constants';


interface AdminOverviewSectionProps {
  navigateToPage: (page: PageName, data?: any) => void;
}

const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300';
      case 'Shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300';
      case 'Processing': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/30 dark:text-yellow-300';
      case 'Pending': return 'bg-gray-200 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300';
      case 'Cancelled':
      case 'Refunded': return 'bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
};

const AdminOverviewSection: React.FC<AdminOverviewSectionProps> = ({ navigateToPage }) => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('zaina-authToken');
            const response = await axios.get(`${API_BASE_URL}/admin/dashboard-stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to load dashboard data.");
        } finally {
            setIsLoading(false);
        }
    };
    fetchStats();
  }, []);

  if (isLoading) return <div className="text-center p-8 text-admin-text-secondary">Loading dashboard statistics...</div>;
  if (error) return <div className="text-center p-8 text-admin-red">{error}</div>;
  if (!stats) return <div className="text-center p-8 text-admin-text-secondary">No statistical data available.</div>;

  const formatValue = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  return (
    <div className="space-y-8">
      <div>
          <h1 className="text-3xl font-bold text-admin-text-primary">Overview</h1>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${formatValue(stats.totalSales)}`}
          icon={DollarSignIcon}
          percentageChange="12.5%"
          changeDirection="up"
          accentColor="#8A5CF5"
          bgColor="bg-admin-accent-light dark:bg-dark-admin-accent-light"
        />
        <StatCard
          title="New Orders"
          value={formatValue(stats.newOrders)}
          icon={ShoppingCartIcon}
          percentageChange="5.2%"
          changeDirection="up"
          accentColor="#22C55E"
          bgColor="bg-green-100 dark:bg-green-500/20"
        />
        <StatCard
          title="Total Customers"
          value={formatValue(stats.totalCustomers)}
          icon={UsersIcon}
          percentageChange="2.1%"
          changeDirection="up"
          accentColor="#3B82F6"
          bgColor="bg-blue-100 dark:bg-blue-500/20"
        />
        <StatCard
          title="Low Stock Items"
          value={formatValue(stats.lowStockItems)}
          icon={PackageIcon}
          percentageChange="10 items"
          changeDirection="down"
          accentColor="#F97316"
          bgColor="bg-orange-100 dark:bg-orange-500/20"
           vsText="require attention"
        />
      </div>

       {/* Recent Orders & Top Products */}
       <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-3 bg-admin-card dark:bg-dark-admin-card p-6 rounded-2xl shadow-admin-soft">
          <h3 className="text-lg font-semibold text-admin-text-primary mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-xs text-admin-text-secondary uppercase">
                  <tr>
                      <th className="py-2 px-3 text-left">Order ID</th>
                      <th className="py-2 px-3 text-left">Customer</th>
                      <th className="py-2 px-3 text-left">Total</th>
                      <th className="py-2 px-3 text-left">Status</th>
                  </tr>
              </thead>
              <tbody>
                {stats.recentOrders && stats.recentOrders.map(order => (
                  <tr key={order.id} className="border-t border-admin-border dark:border-dark-admin-border">
                    <td className="py-3 px-3 font-medium text-admin-accent">#{order.id.slice(-6)}</td>
                    <td className="py-3 px-3">{order.customerName}</td>
                    <td className="py-3 px-3">₹{order.totalAmount.toFixed(2)}</td>
                    <td className="py-3 px-3">
                        <span className={`px-2 py-1 text-[10px] font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                        </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
             {(!stats.recentOrders || stats.recentOrders.length === 0) && <p className="text-center py-6 text-admin-text-secondary">No recent orders.</p>}
          </div>
        </div>

        {/* Top Selling Products List */}
        <div className="lg:col-span-2 bg-admin-card dark:bg-dark-admin-card p-6 rounded-2xl shadow-admin-soft">
          <h3 className="text-lg font-semibold text-admin-text-primary mb-4">Top Selling Products</h3>
          <ul className="space-y-4">
            {stats.topSellingProducts && stats.topSellingProducts.map(item => (
              <li key={item.id} className="flex items-center gap-4">
                <img src={item.imageUrl || PLACEHOLDER_IMAGE_URL} className="w-12 h-14 rounded-md object-cover flex-shrink-0 bg-gray-100"/>
                <div className="flex-grow">
                  <p className="font-medium text-sm text-admin-text-primary line-clamp-1">{item.name}</p>
                  <p className="text-xs text-admin-text-secondary">{item.totalSold} units sold</p>
                </div>
              </li>
            ))}
          </ul>
          {(!stats.topSellingProducts || stats.topSellingProducts.length === 0) && <p className="text-center py-6 text-admin-text-secondary">No sales data available yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewSection;
