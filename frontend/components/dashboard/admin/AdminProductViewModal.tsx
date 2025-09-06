import React from 'react';
import { Product, ProductVariant } from '../../../types';
import { PLACEHOLDER_IMAGE_URL } from '../../../constants';
import CloseIcon from '../../icons/CloseIcon';

interface AdminProductViewModalProps {
  product: Product | null;
  onClose: () => void;
}

const DetailRow: React.FC<{ label: string; value: React.ReactNode; className?: string }> = ({ label, value, className }) => (
  <div className={`flex flex-col sm:flex-row py-2 border-b border-gray-200 dark:border-gray-700 ${className}`}>
    <dt className="w-full sm:w-1/4 font-semibold text-gray-600 dark:text-gray-400">{label}</dt>
    <dd className="w-full sm:w-3/4 mt-1 sm:mt-0 text-gray-800 dark:text-gray-200">{value || 'N/A'}</dd>
  </div>
);

const getStatusPill = (status: Product['publishStatus']) => {
    const styles = {
        Published: 'bg-green-100 text-green-800 dark:bg-green-800/50 dark:text-green-300',
        Draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/50 dark:text-yellow-300',
        Hidden: 'bg-gray-200 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300',
    };
    return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${styles[status || 'Draft']}`}>{status}</span>;
}

const AdminProductViewModal: React.FC<AdminProductViewModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-dark-admin-card w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-admin-text-primary dark:text-dark-admin-text-primary truncate">
            {product.name}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Close product view">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Top Section: Image + Key Details */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
                <img src={product.imageUrl || PLACEHOLDER_IMAGE_URL} alt={product.name} className="w-full aspect-[3/4] object-cover rounded-lg shadow-md" />
                 {product.images && product.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                        {product.images.slice(0, 4).map((img, i) => (
                            <img key={i} src={img} className="w-full aspect-square object-cover rounded-md"/>
                        ))}
                    </div>
                 )}
            </div>
            <div className="md:col-span-2">
                <dl>
                    <DetailRow label="Status" value={getStatusPill(product.publishStatus)} />
                    <DetailRow label="Selling Price" value={`₹${product.price.toFixed(2)}`} />
                    <DetailRow label="MRP" value={`₹${product.mrp.toFixed(2)}`} />
                    <DetailRow label="Category" value={`${product.category} ${product.subCategory ? `> ${product.subCategory}` : ''}`} />
                    <DetailRow label="Base SKU" value={product.sku} />
                    <DetailRow label="Base Stock" value={product.stockQuantity ?? 'Managed by variants'} />
                    <DetailRow label="Tags" value={product.tags?.join(', ')} />
                    <DetailRow label="Short Description" value={<p className="whitespace-pre-wrap">{product.description}</p>} />
                </dl>
            </div>
          </section>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && product.variants.some(v => Object.keys(v.attributes).length > 0) && (
            <section>
              <h3 className="text-lg font-semibold mb-2 text-admin-text-primary dark:text-dark-admin-text-primary">Product Variants</h3>
              <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th className="p-3 text-left font-semibold">Attributes</th>
                      <th className="p-3 text-left font-semibold">SKU</th>
                      <th className="p-3 text-left font-semibold">Price</th>
                      <th className="p-3 text-left font-semibold">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {product.variants.map(v => (
                      <tr key={v.id}>
                        <td className="p-3">{Object.entries(v.attributes).map(([key, value]) => `${key}: ${value}`).join(', ')}</td>
                        <td className="p-3">{v.sku}</td>
                        <td className="p-3">₹{v.price.toFixed(2)}</td>
                        <td className="p-3">{v.stockQuantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

           {/* Long Description */}
           {product.longDescriptionHtml && (
                <section>
                    <h3 className="text-lg font-semibold mb-2">Long Description</h3>
                    <div className="p-4 border rounded-lg prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: product.longDescriptionHtml }}/>
                </section>
            )}
        </main>
         <style>{`
            @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
            .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
        `}</style>
      </div>
    </div>
  );
};

export default AdminProductViewModal;