
import React from 'react';
import jsPDF from 'jspdf';
import JsBarcode from 'jsbarcode';
import TruckIcon from '../../icons/TruckIcon';

interface AddressInfo {
  name: string;
  address: string;
  city: string;
}

interface ShippingLabelData {
  companyLogo?: string;
  from: AddressInfo;
  to: AddressInfo;
  orderNo: string;
  refNo?: string;
  deliveryInstructions?: string;
}

interface ShippingLabelDownloaderProps {
  shippingLabelData: ShippingLabelData;
}

const ShippingLabelDownloader: React.FC<ShippingLabelDownloaderProps> = ({ shippingLabelData }) => {
  const { from, to, orderNo, refNo, deliveryInstructions } = shippingLabelData;

  const generateLabel = () => {
    // A6 size in mm: 105 x 148. 
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a6'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 8;

    // Logo (placeholder)
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('ZAINA COLLECTION', margin, margin + 4);

    // FROM / TO section
    doc.setDrawColor(0);
    doc.line(margin, margin + 10, pageWidth - margin, margin + 10);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('FROM:', margin, margin + 15);
    doc.setFont('helvetica', 'normal');
    const fromAddress = doc.splitTextToSize(`${from.name}\n${from.address}\n${from.city}`, (pageWidth / 2) - margin - 5);
    doc.text(fromAddress, margin, margin + 18);

    doc.setFont('helvetica', 'bold');
    doc.text('TO:', pageWidth / 2, margin + 15);
    doc.setFont('helvetica', 'normal');
    const toAddress = doc.splitTextToSize(`${to.name}\n${to.address}\n${to.city}`, (pageWidth / 2) - margin - 5);
    doc.text(toAddress, pageWidth / 2, margin + 18);

    doc.line(margin, margin + 40, pageWidth - margin, margin + 40);

    // Order Details
    const middleY = margin + 50;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Ref Number: ${refNo || 'N/A'}`, margin, middleY);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Order: ${orderNo.slice(-12)}`, margin, middleY + 8);
    
    // Barcode generation
    const canvas = document.createElement('canvas');
    try {
        JsBarcode(canvas, orderNo, {
            format: "CODE128",
            displayValue: false,
            margin: 0,
            width: 2.5,
            height: 50
        });
        const barcodeDataUrl = canvas.toDataURL('image/png');
        const barcodeWidth = pageWidth - (margin * 2);
        const barcodeHeight = 25; 
        doc.addImage(barcodeDataUrl, 'PNG', margin, middleY + 12, barcodeWidth, barcodeHeight);
    } catch(e) {
        console.error("Could not generate barcode", e);
        doc.setFontSize(8);
        doc.text("Barcode could not be generated.", margin, middleY + 20);
    }
    
    doc.line(margin, margin + 90, pageWidth - margin, margin + 90);

    // Bottom section
    const bottomY = margin + 100;
    doc.setFontSize(10);
    doc.text(`Order No: ${orderNo}`, margin, bottomY);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('Delivery Instructions:', margin, bottomY + 6);
    doc.setFont('helvetica', 'normal');
    const instructions = doc.splitTextToSize(deliveryInstructions || 'No specific instructions.', pageWidth - (margin * 2));
    doc.text(instructions, margin, bottomY + 9);

    doc.save(`shipping-label-${orderNo}.pdf`);
  };

  return (
    <button onClick={generateLabel} className="text-gray-600 dark:text-gray-400 hover:underline text-xs inline-flex items-center bg-white dark:bg-gray-700 px-2 py-1.5 rounded-md border border-gray-300 dark:border-gray-600">
      <TruckIcon className="w-3.5 h-3.5 mr-1" /> Print Label
    </button>
  );
};

export default ShippingLabelDownloader;