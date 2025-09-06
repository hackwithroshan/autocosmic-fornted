import React from 'react';
import { HomepageSection, SectionType } from '../types';
import HeroIcon from './icons/preview/HeroIcon';
import CardsIcon from './icons/preview/CardsIcon';
import GalleryIcon from './icons/preview/GalleryIcon';
import TestimonialIcon from './icons/preview/TestimonialIcon';
import VideoIcon from './icons/preview/VideoIcon';
import ColumnsIcon from './icons/preview/ColumnsIcon';
import CtaIcon from './icons/preview/CtaIcon';
import TeamIcon from './icons/preview/TeamIcon';
import AccordionIcon from './icons/preview/AccordionIcon';
import StatsIcon from './icons/preview/StatsIcon';
import DividerIcon from './icons/preview/DividerIcon';
import HeadingIcon from './icons/preview/HeadingIcon';
import TextIcon from './icons/preview/TextIcon';
import ImageIcon from './icons/preview/ImageIcon';
import PricingIcon from './icons/preview/PricingIcon';
import MapIcon from './icons/preview/MapIcon';
import PromoGrid2Icon from './icons/preview/PromoGrid2Icon';
import TabbedContentIcon from './icons/preview/TabbedContentIcon';

interface ComponentLibraryProps {
    setDraggedItem: (item: AvailableSection) => void;
    setDraggedFrom: (from: 'library') => void;
    onDragEnd: () => void;
}

type AvailableSection = {
  type: SectionType;
  name: string;
  props?: any;
  icon: React.FC<{className?: string}>;
  children?: HomepageSection[];
};

const availableSections: { category: string, items: AvailableSection[] }[] = [
    {
        category: "Layout",
        items: [
            { type: 'ColumnsSection', name: 'Columns', icon: ColumnsIcon, props: { columnCount: 2 }, children: [{id: `col_${Date.now()}_1`, type: 'Column', name:'Column 1', children:[]}, {id: `col_${Date.now()}_2`, type: 'Column', name:'Column 2', children:[]}] },
            { type: 'DividerSection', name: 'Spacer', icon: DividerIcon, props: { space: 50, showLine: true, lineColor: '#E5E7EB' }},
            { type: 'CategoryGrid', name: 'Grid', icon: GalleryIcon, children: [
                { id: 'cgcard_1', type: 'CategoryGridCard', name: 'Grid Card 1', props: { title: 'Card 1', gridSpan: 1 } },
                { id: 'cgcard_2', type: 'CategoryGridCard', name: 'Grid Card 2', props: { title: 'Card 2', gridSpan: 1 } },
            ] },
        ]
    },
     {
        category: "Basic Elements",
        items: [
            { type: 'Element_Heading', name: 'Heading', icon: HeadingIcon, props: { text: 'Your Heading', level: 'h2' } },
            { type: 'Element_Text', name: 'Text', icon: TextIcon, props: { text: 'Some paragraph text.' } },
            { type: 'Element_Image', name: 'Image', icon: ImageIcon, props: { src: 'https://placehold.co/600x400', alt: '' } },
            { type: 'Element_Button', name: 'Button', icon: CtaIcon, props: { text: 'Click Me', href: '#' } },
            { type: 'CategoryGridCard', name: 'Grid Card', icon: ImageIcon, props: { title: 'New Card', gridSpan: 1 } },
            { type: 'TopCategoryCard', name: 'Top Category Card', icon: CardsIcon, props: { name: 'New Category', itemCount: 0, imageUrl: 'https://i.imgur.com/y88ERy0.png', backgroundColor: '#f0f0f0', textColor: '#2C3E50' } },
        ]
    },
    {
        category: "Content",
        items: [
            { type: 'HeadingSection', name: 'Section Heading', icon: HeadingIcon, props: { text: 'Main Heading Text', level: 'h2', align: 'center' } },
            { type: 'RichTextSection', name: 'Rich Text', icon: TextIcon, props: { html: '<p>This is a paragraph of rich text. You can <b>bold</b>, <i>italicize</i>, and more.</p>' } },
            { type: 'ImageWithTextSection', name: 'Image + Text', icon: ImageIcon, props: { imageSide: 'left', imageUrl: 'https://placehold.co/600x400', title: 'Image with Text', text: 'Some descriptive text goes here.' } },
            { type: 'VideoEmbedSection', name: 'Video Embed', icon: VideoIcon, props: { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' } },
            { type: 'GoogleMapSection', name: 'Google Map', icon: MapIcon, props: { embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.3059695!2d-74.2598661352446!3d40.69714941932137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1678886400000!5m2!1sen!2sin' } },
            { type: 'HeroSlider', name: 'Hero Slider', icon: HeroIcon },
        ]
    },
    {
        category: "E-commerce",
        items: [
            { type: 'ProductGrid', name: 'Product Grid', props: { title: 'Featured Products' }, icon: CardsIcon },
            { 
                type: 'PromoGrid2', 
                name: 'Advanced Promo Grid', 
                icon: PromoGrid2Icon,
                props: {
                    card1: { tag: 'New Arrivals', title: "Women's Style", subtitle: 'Up to 70% Off', buttonText: 'Shop Now', buttonLink: '#', buttonColor: '#FFFFFF', buttonTextColor: '#000000', textColor: '#000000', backgroundColor: '#e2e2e2' },
                    card2: { tag: '25% OFF', title: 'Handbag', subtitle: 'Shop Now >', buttonText: '', buttonLink: '#', textColor: '#FFFFFF', backgroundColor: '#d1d1d1' },
                    card3: { tag: '45% OFF', title: 'Watch', subtitle: 'Shop Now >', buttonText: '', buttonLink: '#', textColor: '#FFFFFF', backgroundColor: '#c5c5c5' },
                    card4: { tag: 'Accessories', title: 'Backpack', subtitle: 'Min. 40-80% Off', buttonText: '', buttonLink: '#', textColor: '#FFFFFF', backgroundColor: '#b2b2b2' }
                }
            },
            { type: 'TopCategories', name: 'Top Categories', props: { title: 'Shop by Category' }, icon: CardsIcon, children: [] },
            { type: 'TrendingProductStrip', name: 'Product Carousel', props: { title: 'New Arrivals' }, icon: CardsIcon },
            { type: 'TabbedProductGrid', name: 'Tabbed Product Grid', icon: TabbedContentIcon, props: { title: 'Popular Products', tabs: [] } },
        ]
    },
    {
        category: "Engagement",
        items: [
            { type: 'CtaSection', name: 'Call-to-Action', icon: CtaIcon, props: { title: 'Join Our Newsletter', subtitle: 'Get the latest updates and offers.', buttonText: 'Subscribe', buttonLink: '#' } },
            { type: 'TestimonialsSlider', name: 'Testimonials', icon: TestimonialIcon },
            { type: 'PricingTableSection', name: 'Pricing Table', icon: PricingIcon },
            { type: 'TeamSection', name: 'Team Members', icon: TeamIcon, props: { title: 'Our Team' } },
            { type: 'StatsCounterSection', name: 'Stats Counter', icon: StatsIcon },
            { type: 'FaqSection', name: 'FAQ / Accordion', icon: AccordionIcon, props: { title: 'Frequently Asked Questions' } },
            { type: 'BlogPreviewSection', name: 'Blog Posts', icon: CardsIcon },
            { type: 'InstagramBanner', name: 'Instagram Banner', icon: GalleryIcon },
        ]
    },
];

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ setDraggedItem, setDraggedFrom, onDragEnd }) => {

    const handleDragStart = (e: React.DragEvent<HTMLButtonElement>, item: AvailableSection) => {
        const data = {
            type: 'component-library-item',
            componentType: item.type
        };
        e.dataTransfer.setData('application/json', JSON.stringify(data));
        setDraggedItem(item);
        setDraggedFrom('library');
    };


    return (
        <div className="p-4" onDragEnd={onDragEnd}>
            {availableSections.map(category => (
                <div key={category.category} className="mb-6">
                    <h3 className="text-xs font-bold uppercase text-gray-400 dark:text-gray-500 mb-2 px-2">{category.category}</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {category.items.map(item => (
                            <button
                                key={item.type}
                                draggable="true"
                                onDragStart={(e) => handleDragStart(e, item)}
                                className="p-2 text-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                title={`Add ${item.name} section`}
                            >
                                <div className="bg-gray-200 dark:bg-gray-700/50 rounded-md p-3 flex items-center justify-center">
                                    <item.icon className="w-10 h-10 text-gray-500 dark:text-gray-400" />
                                </div>
                                <p className="text-xs mt-1.5 text-gray-600 dark:text-gray-300">{item.name}</p>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ComponentLibrary;