

import React, { useState, useCallback } from 'react';
import UploadCloudIcon from '../../icons/UploadCloudIcon';
import FileCsvIcon from '../../icons/FileCsvIcon';
import { Product } from '../../../types';

interface AdminBulkUploadSectionProps {
  products: Product[];
  onBulkSaveProducts: (products: Product[], counts: { created: number; updated: number }) => void;
}

const downloadCSV = (content: string, fileName: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

const generateCsvTemplate = () => {
    const headers = [
        'name', 'description', 'price', 'mrp', 'sku', 'stockQuantity', 'category', 'tags', 'imageUrl'
    ];    
    const csvContent = headers.join(',');
    downloadCSV(csvContent, 'product_upload_template.csv');
};

// A more robust, stateful CSV parser to handle quotes and escaped quotes.
const parseCsvRow = (row: string): string[] => {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < row.length; i++) {
        const char = row[i];

        if (char === '"') {
            if (inQuotes && row[i + 1] === '"') {
                current += '"'; // Escaped quote
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current); // Add the last value

    return values;
};


const AdminBulkUploadSection: React.FC<AdminBulkUploadSectionProps> = ({ products, onBulkSaveProducts }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (e.dataTransfer.files[0].type === 'text/csv' || e.dataTransfer.files[0].name.endsWith('.csv')) {
        setFile(e.dataTransfer.files[0]);
        setUploadMessage('');
      } else {
        alert("Please upload a valid CSV file.");
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setUploadMessage('');
      } else {
        alert("Please upload a valid CSV file.");
        e.target.value = ''; // Reset input on invalid file
      }
    }
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }
    setIsUploading(true);
    setUploadMessage('Reading file...');

    const reader = new FileReader();
    reader.onload = (e) => {
        let text = e.target?.result as string;
        if (!text) {
            setUploadMessage('Error: Could not read file content.');
            setIsUploading(false);
            return;
        }

        // Remove BOM (Byte Order Mark) if present
        if (text.charCodeAt(0) === 0xFEFF) {
            text = text.substring(1);
        }

        try {
            setUploadMessage('Processing data...');
            const lines = text.trim().split(/\r?\n/);
            if (lines.length < 2) {
                throw new Error("CSV must have a header and at least one data row.");
            }

            const rawHeaders = parseCsvRow(lines[0]);
            // Clean headers: lowercase and remove all whitespace
            const cleanedHeaders = rawHeaders.map(h => h.trim().toLowerCase().replace(/\s+/g, ''));
            
            const requiredHeaders = ['name', 'price', 'mrp', 'sku', 'stockquantity', 'category'];
            
            const missingHeaders = requiredHeaders.filter(h => !cleanedHeaders.includes(h));
            if (missingHeaders.length > 0) {
                throw new Error(`CSV is missing required headers: ${missingHeaders.join(', ')}. Please use the template.`);
            }
            
            const productsFromCsv: Product[] = [];
            let createdCount = 0;
            let updatedCount = 0;
            const existingSkus = new Set(products.map(p => p?.sku).filter(Boolean));

            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue;
                
                const values = parseCsvRow(lines[i]);
                if (values.length !== cleanedHeaders.length) {
                    console.warn(`Skipping row ${i + 1} due to mismatched column count. Expected ${cleanedHeaders.length}, found ${values.length}. Row: "${lines[i]}"`);
                    continue;
                }
                
                const row: Record<string, any> = {};
                cleanedHeaders.forEach((header, index) => {
                    row[header] = values[index] || '';
                });

                if (!row.sku) {
                    console.warn(`Skipping row ${i + 1} due to missing SKU.`);
                    continue;
                }

                const productData: Partial<Product> = {
                    name: row.name,
                    description: row.description || '',
                    price: parseFloat(row.price),
                    mrp: parseFloat(row.mrp),
                    sku: row.sku,
                    stockQuantity: parseInt(row.stockquantity, 10),
                    category: row.category,
                    tags: row.tags ? row.tags.split('|').map((t: string) => t.trim()) : [],
                    publishStatus: 'Published',
                    imageUrl: row.imageurl || '',
                    isNew: true,
                    isBestSeller: false,
                    id: `prod_${Date.now()}_${i}` 
                };

                if (!productData.name || isNaN(productData.price!) || !productData.sku || isNaN(productData.stockQuantity!) || !productData.category || isNaN(productData.mrp!)) {
                    console.warn(`Skipping row ${i + 1} due to invalid or missing required data.`, row);
                    continue;
                }
                
                if (existingSkus.has(productData.sku!)) {
                    updatedCount++;
                } else {
                    createdCount++;
                }
                
                productsFromCsv.push(productData as Product);
            }

            if (productsFromCsv.length > 0) {
                onBulkSaveProducts(productsFromCsv, { created: createdCount, updated: updatedCount });
            }

            setUploadMessage(`Upload successful! ${createdCount} created, ${updatedCount} updated. Check notifications for summary.`);

        } catch (error: any) {
            console.error("CSV Processing Error:", error);
            setUploadMessage(`Error: ${error.message}`);
        } finally {
            setIsUploading(false);
            setFile(null);
        }
    };

    reader.readAsText(file);
  };
  
  return (
    <div className="bg-admin-light-card dark:bg-admin-dark-card p-8 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-admin-light-text dark:text-admin-dark-text">Bulk Product Upload</h1>
      <p className="mt-2 text-admin-light-text-secondary dark:text-admin-dark-text-secondary mb-6">
        Efficiently add or update products by uploading a CSV file.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
            <h3 className="font-semibold mb-2">Instructions</h3>
            <ol className="list-decimal list-inside text-sm text-admin-light-text-secondary dark:text-admin-dark-text-secondary space-y-2">
                <li>Download the CSV template to ensure correct formatting.</li>
                <li>Fill in the product details. Required columns are `name`, `price`, `mrp`, `sku`, `stockQuantity`, and `category`.</li>
                <li><strong className="text-green-600 dark:text-green-400">Tip:</strong> To include commas in fields like `name` or `description`, enclose the entire field in double quotes (e.g., `"Red Kurta, Cotton"`).</li>
                <li>For multiple tags, use a pipe (|) separator (e.g., `Festive|Wedding`).</li>
                <li>Ensure all SKUs are unique. Existing SKUs will be updated with the data in the file; new SKUs will be created as new products.</li>
                <li>Save the file and upload it using the form. Your inventory will be updated.</li>
            </ol>
             <button onClick={generateCsvTemplate} className="mt-4 bg-gray-200 dark:bg-gray-600 text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center">
                 <FileCsvIcon className="w-5 h-5 mr-2"/> Download CSV Template
             </button>
        </div>
        
        <div>
            <div 
              className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-center"
              onDragOver={e => {e.preventDefault(); e.stopPropagation();}}
              onDragEnter={e => {e.preventDefault(); e.stopPropagation();}}
              onDrop={handleFileDrop}
            >
              <UploadCloudIcon className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <label htmlFor="file-upload" className="font-medium text-admin-accent hover:underline cursor-pointer">
                  Click to upload
                </label>
                {' '}or drag and drop
              </p>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".csv" />
              <p className="text-xs text-gray-500">CSV file up to 10MB</p>
            </div>
            
            {file && (
                <div className="mt-4">
                    <p className="text-sm font-medium">Selected file: <span className="text-admin-accent">{file.name}</span></p>
                    {isUploading ? (
                        <p className="text-sm text-admin-accent mt-2">{uploadMessage}</p>
                    ) : (
                        <button onClick={handleUpload} className="w-full mt-2 bg-admin-accent text-white font-semibold py-2 rounded-lg hover:bg-admin-accent-hover">
                            Start Upload
                        </button>
                    )}
                </div>
            )}
            {uploadMessage && !isUploading && (
                <p className={`mt-4 text-sm font-medium ${uploadMessage.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>{uploadMessage}</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminBulkUploadSection;