import React, { useState } from 'react';
import { StoreSettings } from '../../types';
import EnvelopeIcon from '../icons/EnvelopeIcon';
import WhatsAppIcon from '../icons/WhatsAppIcon';
import InputField from '../shared/InputField'; 

interface ContactPageProps {
  storeSettings: StoreSettings;
}

const ContactPage: React.FC<ContactPageProps> = ({ storeSettings }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error' | 'idle', message: string }>({ type: 'idle', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus({ type: 'idle', message: '' });
    if (!formData.name || !formData.email || !formData.message) {
        setFormStatus({ type: 'error', message: 'All fields are required.'});
        return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setFormStatus({ type: 'error', message: 'Please enter a valid email.'});
        return;
    }
    
    console.log('Contact form submitted:', formData);
    setFormStatus({ type: 'success', message: 'Thank you for your message! We will get back to you soon.'});
    setFormData({ name: '', email: '', message: '' }); 
  };
  
  const whatsappNumber = storeSettings.supportPhone.replace(/\D/g, '');

  return (
    <div className="bg-zaina-sky-blue-light min-h-screen py-12 md:py-16 font-body-jost">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-heading-playfair font-bold text-zaina-text-primary mb-3">
            Get In Touch
          </h1>
          <p className="text-lg text-zaina-slate-gray max-w-2xl mx-auto">
            We'd love to hear from you! Whether you have a question about our products, an order, or just want to share your Zaina story.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          
          <div className="bg-zaina-white p-6 md:p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl font-heading-cormorant font-semibold text-zaina-text-primary mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <InputField
                label="Your Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Aanya Sharma"
                required
              />
              <InputField
                label="Your Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g., aanya@example.com"
                required
              />
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-zaina-text-primary mb-1">Your Message {<span className="text-zaina-deep-red-accent">*</span>}</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className="w-full px-3 py-2 border border-zaina-neutral-medium rounded-md shadow-sm focus:ring-zaina-primary focus:border-zaina-primary text-sm text-zaina-text-primary placeholder-zaina-slate-gray"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-zaina-primary text-zaina-white font-semibold py-3 px-6 rounded-md hover:opacity-90 transition duration-300 text-lg"
              >
                Send Message
              </button>
              {formStatus.message && (
                <p className={`text-sm mt-3 ${formStatus.type === 'success' ? 'text-green-600' : 'text-zaina-deep-red-accent'}`}>
                  {formStatus.message}
                </p>
              )}
            </form>
          </div>

          
          <div className="space-y-8">
            <div className="bg-zaina-white p-6 md:p-8 rounded-lg shadow-xl">
              <h2 className="text-2xl font-heading-cormorant font-semibold text-zaina-text-primary mb-4">Support Channels</h2>
              <div className="space-y-4">
                <a href={`mailto:${storeSettings.supportEmail}`} className="flex items-center text-zaina-text-primary hover:text-zaina-primary transition-colors group">
                  <EnvelopeIcon className="w-5 h-5 mr-3 text-zaina-primary group-hover:text-zaina-cta-peach" />
                  <span>{storeSettings.supportEmail}</span>
                </a>
                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-zaina-text-primary hover:text-zaina-primary transition-colors group">
                  <WhatsAppIcon className="w-5 h-5 mr-3 text-zaina-primary group-hover:text-zaina-cta-peach" />
                  <span>Chat with us on WhatsApp</span>
                </a>
              </div>
              <p className="text-sm text-zaina-slate-gray mt-4">
                Our support team is available Mon - Sat, 10 AM - 6 PM IST.
              </p>
            </div>
            
            <div className="bg-zaina-white p-6 md:p-8 rounded-lg shadow-xl">
                 <h2 className="text-2xl font-heading-cormorant font-semibold text-zaina-text-primary mb-4">Visit Our Store (By Appointment)</h2>
                <p className="text-zaina-slate-gray mb-3">123 Elegance Avenue, Fashion City, India</p>
                <div className="aspect-w-16 aspect-h-9 bg-zaina-neutral-medium rounded-md flex items-center justify-center text-zaina-slate-gray">
                    Google Map Placeholder (Embed iframe here if needed)
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
