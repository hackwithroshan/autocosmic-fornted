
import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import FilePdfIcon from '../../icons/FilePdfIcon';

interface InvoiceItem {
  qty: number;
  description: string;
  unitPriceExcl: number;
  vatRate: number;
}

interface InvoiceData {
  billingName: string;
  billingAddress: string;
  shippingName: string;
  shippingAddress: string;
  orderNumber: string;
  invoiceNumber: string;
  orderDate: string;
  invoiceDate: string;
  items: InvoiceItem[];
}

interface InvoiceDownloaderProps {
  invoiceData: InvoiceData;
}

const InvoiceDownloader: React.FC<InvoiceDownloaderProps> = ({ invoiceData }) => {
  const handleDownload = () => {
    const doc = new jsPDF();
    const {
      billingName, billingAddress, shippingName, shippingAddress,
      orderNumber, invoiceNumber, orderDate, invoiceDate, items
    } = invoiceData;

    // --- Calculations ---
    const calculatedItems = items.map(item => {
      const vatAmount = item.unitPriceExcl * (item.vatRate / 100);
      const unitPriceIncl = item.unitPriceExcl + vatAmount;
      const totalPrice = unitPriceIncl * item.qty;
      return {
        ...item,
        unitPriceIncl,
        totalPrice
      };
    });

    const subtotalExclVat = calculatedItems.reduce((sum, item) => sum + (item.unitPriceExcl * item.qty), 0);
    const grandTotal = calculatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const vatTotal = grandTotal - subtotalExclVat;

    const formatCurrency = (amount: number) => `£${amount.toFixed(2)}`;

    // --- PDF Content ---
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    const margin = 15;

    // Logo and Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('ZINA', margin, 20);

    doc.setFontSize(14);
    doc.text('INVOICE', pageWidth - margin, 20, { align: 'right' });

    // Addresses
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Billing Address', margin, 35);
    doc.text('Shipping Address', pageWidth / 2, 35);

    doc.setFont('helvetica', 'normal');
    const billAddressLines = doc.splitTextToSize(`${billingName}\n${billingAddress}`, (pageWidth / 2) - margin - 5);
    doc.text(billAddressLines, margin, 40);

    const shipAddressLines = doc.splitTextToSize(`${shippingName}\n${shippingAddress}`, (pageWidth / 2) - margin - 5);
    doc.text(shipAddressLines, pageWidth / 2, 40);

    // Order Details
    autoTable(doc, {
        startY: 65,
        body: [
            ['Order Number:', orderNumber, 'Invoice Number:', invoiceNumber],
            ['Order Date:', orderDate, 'Invoice Date:', invoiceDate]
        ],
        theme: 'plain',
        styles: { fontSize: 9, cellPadding: 1 },
        columnStyles: {
            0: { fontStyle: 'bold' },
            2: { fontStyle: 'bold' },
        }
    });

    const tableStartY = (doc as any).lastAutoTable.finalY + 10;

    // Items Table
    autoTable(doc, {
        startY: tableStartY,
        head: [['Qty', 'Item Description', 'Unit Price (excl. VAT)', 'VAT Rate (%)', 'Unit Price (incl. VAT)', 'Total Price (incl. VAT)']],
        body: calculatedItems.map(item => [
            item.qty,
            item.description,
            formatCurrency(item.unitPriceExcl),
            `${item.vatRate}%`,
            formatCurrency(item.unitPriceIncl),
            formatCurrency(item.totalPrice)
        ]),
        theme: 'striped',
        headStyles: {
            fillColor: [230, 230, 230],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            fontSize: 8
        },
        bodyStyles: {
            fontSize: 8
        },
        columnStyles: {
            0: { halign: 'center' },
            2: { halign: 'right' },
            3: { halign: 'center' },
            4: { halign: 'right' },
            5: { halign: 'right' }
        }
    });

    const totalsTableStartY = (doc as any).lastAutoTable.finalY;

    // Totals section
    autoTable(doc, {
        startY: totalsTableStartY + 5,
        body: [
            ['Subtotal (excl. VAT):', formatCurrency(subtotalExclVat)],
            ['VAT:', formatCurrency(vatTotal)],
            [{ content: 'Final total to be paid:', styles: { fontStyle: 'bold'} }, { content: formatCurrency(grandTotal), styles: { fontStyle: 'bold'} }]
        ],
        theme: 'plain',
        styles: { fontSize: 9 },
        columnStyles: {
            0: { halign: 'right', fontStyle: 'bold' },
            1: { halign: 'right' },
        },
        tableWidth: 'wrap',
        margin: { left: pageWidth - 70 } // Align to the right
    });
    
    // Download
    doc.save(`invoice-${orderNumber}.pdf`);
  };

  return (
    <button onClick={handleDownload} className="text-gray-600 dark:text-gray-400 hover:underline text-xs inline-flex items-center">
      <FilePdfIcon className="w-3.5 h-3.5 mr-1" /> Download Invoice
    </button>
  );
};

export default InvoiceDownloader;
