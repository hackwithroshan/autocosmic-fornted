import React, { useState, useMemo } from 'react';
import { Customer, Order, Product } from '../../../types';
import BarChartIcon from '../../icons/BarChartIcon';
import UsersIcon from '../../icons/UsersIcon';
import ShoppingBagIcon from '../../icons/ShoppingBagIcon';
import FileCsvIcon from '../../icons/FileCsvIcon';
import FilePdfIcon from '../../icons/FilePdfIcon';
import GiftIcon from '../../icons/GiftIcon'; 
import DashboardCard from '../common/DashboardCard';
import DollarSignIcon from '../../icons/DollarSignIcon';
import ActivityIcon from '../../icons/ActivityIcon';

interface AdminAnalyticsSectionProps {
  orders: Order[];
  products: Product[];
  customers: Customer[];
}

const AdminAnalyticsSection: React.FC<AdminAnalyticsSectionProps> = ({ orders, products, customers }) => {
    
    // Calculate real-time stats from props
    const totalRevenue = useMemo(() => orders.reduce((sum, order) => sum + order.totalAmount, 0), [orders]);
    const totalOrders = orders.length;
    const totalCustomers = customers.length;
    const avgOrderValue = useMemo(() => (totalOrders > 0 ? totalRevenue / totalOrders : 0), [totalRevenue, totalOrders]);
    
    const topSellingProducts = useMemo(() => {
        const salesCount = new Map<string, number>();
        orders.forEach(order => {
            order.items.forEach(item => {
                salesCount.set(item.id, (salesCount.get(item.id) || 0) + item.quantity);
            });
        });
        
        return Array.from(salesCount.entries())
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 4)
            .map(([id, count]) => ({
                product: products.find(p => p.id === id),
                count
            }))
            .filter(item => item.product);

    }, [orders, products]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h2 className="text-xl font-semibold font-heading-playfair text-admin-text dark:text-admin-dark-text">Analytics & Reports</h2>
        <div className="flex gap-2">
            <button onClick={() => alert("Export Sales Report as CSV (simulated)")} className="bg-green-500 text-white text-xs font-medium py-2 px-3 rounded-lg hover:bg-green-600 flex items-center">
                <FileCsvIcon className="w-4 h-4 mr-1.5"/> Export CSV
            </button>
            <button onClick={() => alert("Export Sales Report as PDF (simulated)")} className="bg-red-500 text-white text-xs font-medium py-2 px-3 rounded-lg hover:bg-red-600 flex items-center">
                <FilePdfIcon className="w-4 h-4 mr-1.5"/> Export PDF
            </button>
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="dateRange" className="text-sm font-medium text-admin-text dark:text-admin-dark-text mr-2">Select Date Range:</label>
        <select id="dateRange" className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-admin-light-card dark:bg-admin-dark-card">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard 
            title="Total Revenue" 
            value={`₹${totalRevenue.toLocaleString('en-IN', {minimumFractionDigits: 2})}`} 
            icon={DollarSignIcon}
            percentageChange="+12%"
            changeDirection="up"
            accentColor="#8A5CF5"
            bgColor="bg-admin-accent-light dark:bg-dark-admin-accent-light"
        />
        <DashboardCard 
            title="Total Orders" 
            value={totalOrders.toString()}
            icon={ShoppingBagIcon}
            percentageChange="+5%"
            changeDirection="up"
            accentColor="#22C55E"
            bgColor="bg-green-100 dark:bg-green-500/20"
        />
        <DashboardCard 
            title="Total Customers" 
            value={totalCustomers.toString()}
            icon={UsersIcon}
            accentColor="#3B82F6"
            bgColor="bg-blue-100 dark:bg-blue-500/20"
        />
        <DashboardCard 
            title="Avg. Order Value" 
            value={`₹${avgOrderValue.toFixed(2)}`}
            icon={ActivityIcon}
            accentColor="#F97316"
            bgColor="bg-orange-100 dark:bg-orange-500/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-admin-card dark:bg-dark-admin-card p-6 rounded-2xl shadow-admin-soft">
          <h3 className="text-lg font-semibold text-admin-text-primary dark:text-dark-admin-text-primary mb-4">Monthly Sales Trend</h3>
          <div className="h-64 bg-admin-light dark:bg-admin-dark/50 rounded-lg flex items-center justify-center text-admin-text-secondary dark:text-dark-admin-text-secondary">
            Monthly Sales Chart Placeholder
          </div>
        </div>
        <div className="bg-admin-card dark:bg-dark-admin-card p-6 rounded-2xl shadow-admin-soft">
          <h3 className="text-lg font-semibold text-admin-text-primary dark:text-dark-admin-text-primary mb-4">Top Selling Products</h3>
           <ul className="text-sm space-y-3">
              {topSellingProducts.map(item => (
                 <li key={item.product!.id} className="flex items-center gap-3">
                     <img src={item.product!.imageUrl} alt={item.product!.name} className="w-10 h-12 object-cover rounded-md"/>
                     <div className="flex-grow">
                        <p className="font-medium truncate">{item.product!.name}</p>
                        <p className="text-xs text-admin-text-secondary dark:text-dark-admin-text-secondary">{item.product!.category}</p>
                     </div>
                     <span className="text-xs text-admin-text-secondary dark:text-dark-admin-text-secondary float-right">{item.count} units sold</span>
                 </li>
              ))}
           </ul>
        </div>
         <div className="bg-admin-card dark:bg-dark-admin-card p-6 rounded-2xl shadow-admin-soft lg:col-span-2">
          <h3 className="text-lg font-semibold text-admin-text-primary dark:text-dark-admin-text-primary mb-4">Conversion Funnel</h3>
          <div className="h-40 bg-admin-light dark:bg-admin-dark/50 rounded-lg flex items-center justify-center text-admin-text-secondary dark:text-dark-admin-text-secondary">
            (Views &gt; Add to Cart &gt; Checkout &gt; Purchase) Chart Placeholder
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsSection;