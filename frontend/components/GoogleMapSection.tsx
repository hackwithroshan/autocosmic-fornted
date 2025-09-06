
import React from 'react';

interface GoogleMapSectionProps {
  embedUrl: string;
}

const GoogleMapSection: React.FC<GoogleMapSectionProps> = ({ embedUrl }) => {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {embedUrl ? (
          <div className="aspect-video w-full shadow-lg rounded-lg overflow-hidden">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-100 rounded-lg">
            <p>Please provide a valid Google Maps embed URL.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default GoogleMapSection;