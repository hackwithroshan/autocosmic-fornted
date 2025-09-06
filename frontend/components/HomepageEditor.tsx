import React from 'react';
import { HomepageSection, SectionType } from '../types';
import CloseIcon from './icons/CloseIcon';
import PlusCircleIcon from './icons/PlusCircleIcon';

interface HomepageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  layout: HomepageSection[];
  setLayout: React.Dispatch<React.SetStateAction<HomepageSection[]>>;
}

const availableSections: { type: SectionType; name: string; defaultProps?: any }[] = [
    { type: 'HeroSlider', name: 'Hero Slider' },
    { type: 'CategoryGrid', name: 'Category Grid' },
    { type: 'PromoGrid2', name: 'Advanced Promo Grid' },
    { type: 'TrendingProductStrip', name: 'New Arrivals Strip', defaultProps: { title: 'New Arrivals', filter: 'isNew' } },
    { type: 'ProductGrid', name: 'Best Sellers Grid', defaultProps: { title: 'Best Sellers', filter: 'isBestSeller' } },
    { type: 'ShoppableVideoCarouselSection', name: 'Shoppable Videos' },
    { type: 'ShopByOccasion', name: 'Shop by Occasion' },
    { type: 'TestimonialsSlider', name: 'Testimonials' },
    { type: 'BlogPreviewSection', name: 'Blog Preview' },
    { type: 'InstagramBanner', name: 'Instagram Banner' },
];


const HomepageEditor: React.FC<HomepageEditorProps> = ({ isOpen, onClose, layout, setLayout }) => {

    const addSection = (section: { type: SectionType; name: string; defaultProps?: any }) => {
        const newSection: HomepageSection = {
            id: `${section.type.toLowerCase()}-${Date.now()}`,
            type: section.type,
            props: section.defaultProps || {}
        };
        setLayout(prev => [...prev, newSection]);
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 z-[100] md:z-40"
            role="dialog"
            aria-modal="true"
            aria-labelledby="editor-title"
        >
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            ></div>
            <div className="absolute top-0 left-0 h-full w-full max-w-sm bg-zaina-white/95 dark:bg-dark-zaina-bg-card/95 backdrop-blur-xl shadow-2xl flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-zaina-neutral-medium dark:border-dark-zaina-neutral-medium flex-shrink-0">
                    <h2 id="editor-title" className="text-xl font-semibold font-heading-playfair">Homepage Editor</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <CloseIcon className="w-6 h-6"/>
                    </button>
                </div>

                <div className="p-4 flex-grow overflow-y-auto">
                    <h3 className="font-semibold mb-3">Add New Section</h3>
                    <div className="space-y-2">
                        {availableSections.map(sec => (
                            <button 
                                key={sec.type}
                                onClick={() => addSection(sec)}
                                className="w-full flex items-center justify-between p-3 text-left bg-zaina-sky-blue-light/50 dark:bg-dark-zaina-sky-blue-light/20 rounded-lg hover:bg-zaina-sky-blue-light dark:hover:bg-dark-zaina-sky-blue-light transition-colors"
                            >
                                <span>{sec.name}</span>
                                <PlusCircleIcon className="w-5 h-5 text-zaina-primary"/>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t border-zaina-neutral-medium dark:border-dark-zaina-neutral-medium flex-shrink-0 flex items-center justify-end gap-3">
                     <button onClick={onClose} className="text-sm font-semibold hover:underline">
                        Close
                    </button>
                    <button onClick={() => alert('Homepage layout saved!')} className="bg-zaina-primary text-zaina-white font-semibold py-2 px-5 rounded-md hover:opacity-90">
                        Save Layout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomepageEditor;