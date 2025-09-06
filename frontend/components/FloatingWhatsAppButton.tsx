
import React from 'react';
import WhatsAppIcon from './icons/WhatsAppIcon';
import { ZainaColor } from '../types'; 

interface FloatingWhatsAppButtonProps {
    storeName: string;
}

const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({ storeName }) => {
  const WHATSAPP_NUMBER = "1234567890"; // Replace with actual WhatsApp number
  const WHATSAPP_MESSAGE = `Hello! I'm interested in ${storeName} products.`;

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-zaina-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 ease-in-out z-40 transform hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <WhatsAppIcon className="w-7 h-7" />
    </a>
  );
};

export default FloatingWhatsAppButton;