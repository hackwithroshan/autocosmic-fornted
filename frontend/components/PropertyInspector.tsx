

import React from 'react';
import { HomepageSection, TeamMember, FaqItem, StatItem, PricingPlan, PromoGrid2CardData, TabbedProductGrid_Tab, TabbedProductGrid_Banner } from '../types';
import InputField from './shared/InputField';
import TrashIcon from './icons/TrashIcon';
import Accordion from './shared/Accordion';
import PlusCircleIcon from './icons/PlusCircleIcon';

interface PropertyInspectorProps {
  layout: HomepageSection[];
  setLayout: (updater: (prevLayout: HomepageSection[]) => HomepageSection[]) => void;
  selectedComponentId: string | null;
}

const fontOptions = ['Playfair Display', 'Cinzel', 'Cormorant Garamond', 'Poppins', 'Inter'];

const ListItemEditor = ({ items, onUpdate, renderItem, defaultItem }: { items: any[], onUpdate: (newItems: any[]) => void, renderItem: (item: any, onChange: (updatedItem: any) => void) => React.ReactNode, defaultItem: any }) => {
    
    const handleItemChange = (index: number, updatedItem: any) => {
        const newItems = [...items];
        newItems[index] = updatedItem;
        onUpdate(newItems);
    };

    const handleAddItem = () => {
        onUpdate([...items, { ...defaultItem, id: `${defaultItem.id_prefix || 'item'}_${Date.now()}` }]);
    };

    const handleRemoveItem = (index: number) => {
        onUpdate(items.filter((_, i) => i !== index));
    };
    
    return (
        <div className="space-y-3">
            {items.map((item, index) => (
                <div key={item.id} className="p-2 border rounded-md relative bg-gray-50 dark:bg-gray-700/50">
                    <button onClick={() => handleRemoveItem(index)} className="absolute top-1 right-1 p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><TrashIcon className="w-3 h-3"/></button>
                    {renderItem(item, (updatedItem) => handleItemChange(index, updatedItem))}
                </div>
            ))}
            <button onClick={handleAddItem} className="text-sm text-blue-600 hover:underline flex items-center gap-1"><PlusCircleIcon className="w-4 h-4" /> Add Item</button>
        </div>
    );
};


const PropertyInspector: React.FC<PropertyInspectorProps> = ({
  layout,
  setLayout,
  selectedComponentId,
}) => {
    
    const findNodeAndParent = (nodes: HomepageSection[], id: string, parent: HomepageSection | null = null): { node: HomepageSection | null; parent: HomepageSection | null } => {
        for (const node of nodes) {
            if (node.id === id) {
                return { node, parent };
            }
            if (node.children) {
                const result = findNodeAndParent(node.children, id, node);
                if (result.node) {
                    return result;
                }
            }
        }
        return { node: null, parent: null };
    };
    
    const { node: selectedComponent } = findNodeAndParent(layout, selectedComponentId || '');

    const updateNode = (id: string, newPropsOrStyles: Partial<HomepageSection>) => {
        const modifier = (nodes: HomepageSection[]): HomepageSection[] => {
            return nodes.map(node => {
                if (node.id === id) {
                    return { ...node, ...newPropsOrStyles };
                }
                if (node.children) {
                    return { ...node, children: modifier(node.children) };
                }
                return node;
            });
        };
        setLayout(modifier);
    };
  
    const updateComponentProp = (id: string, propName: string, value: any) => {
        updateNode(id, { props: { ...(selectedComponent?.props || {}), [propName]: value } });
    };

    const updateComponentStyle = (id: string, propName: keyof React.CSSProperties, value: any) => {
        updateNode(id, { styles: { ...(selectedComponent?.styles || {}), [propName]: value } });
    };

    const updateComponentName = (id: string, name: string) => {
        updateNode(id, { name });
    };
    
    const addElement = (parentId: string, type: 'Element_Heading' | 'Element_Text' | 'Element_Image' | 'Element_Button') => {
        const defaults = {
            Element_Heading: { name: 'Heading', props: { text: 'New Heading', level: 'h3' } },
            Element_Text: { name: 'Text', props: { text: 'Some new text.' } },
            Element_Image: { name: 'Image', props: { src: 'https://placehold.co/400x300', alt: '' } },
            Element_Button: { name: 'Button', props: { text: 'Click Me', href: '#' } },
        };
        const newElement: HomepageSection = {
            id: `${type.toLowerCase()}-${Date.now()}`,
            type: type,
            ...defaults[type],
        };
        
        const modifier = (nodes: HomepageSection[]): HomepageSection[] => {
             return nodes.map(node => {
                if (node.id === parentId) {
                    return { ...node, children: [...(node.children || []), newElement] };
                }
                if (node.children) {
                    return { ...node, children: modifier(node.children) };
                }
                return node;
            });
        };
        setLayout(modifier);
    };

    const removeComponent = (id: string) => {
        const remover = (nodes: HomepageSection[]): HomepageSection[] => {
            return nodes.filter(node => node.id !== id).map(node => {
                if (node.children) {
                    return { ...node, children: remover(node.children) };
                }
                return node;
            });
        };
        setLayout(remover);
    };

  if (!selectedComponent) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        <p className="text-sm">Select a component on the page to edit its properties.</p>
      </div>
    );
  }

  const props = selectedComponent.props || {};

  const renderSpecificEditors = () => {
    switch(selectedComponent.type) {
        // --- NEW INNER COMPONENTS ---
        case 'Column':
            return (
                <div>
                    <h4 className="font-medium text-sm text-gray-600 dark:text-gray-300 mb-2">Add Element</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => addElement(selectedComponent.id, 'Element_Heading')} className="p-2 text-xs border rounded hover:bg-gray-100 dark:hover:bg-gray-700">Heading</button>
                        <button onClick={() => addElement(selectedComponent.id, 'Element_Text')} className="p-2 text-xs border rounded hover:bg-gray-100 dark:hover:bg-gray-700">Text</button>
                        <button onClick={() => addElement(selectedComponent.id, 'Element_Image')} className="p-2 text-xs border rounded hover:bg-gray-100 dark:hover:bg-gray-700">Image</button>
                        <button onClick={() => addElement(selectedComponent.id, 'Element_Button')} className="p-2 text-xs border rounded hover:bg-gray-100 dark:hover:bg-gray-700">Button</button>
                    </div>
                </div>
            );
        case 'Element_Heading':
            return <InputField name="text" label="Text" value={props.text || ''} onChange={(e) => updateComponentProp(selectedComponent.id, 'text', e.target.value)} />;
        case 'Element_Text':
            return <InputField name="text" as="textarea" label="Text" value={props.text || ''} onChange={(e) => updateComponentProp(selectedComponent.id, 'text', e.target.value)} />;
        case 'Element_Image':
            return <InputField name="src" label="Image URL" value={props.src || ''} onChange={(e) => updateComponentProp(selectedComponent.id, 'src', e.target.value)} />;
        case 'Element_Button':
            return <>
                <InputField name="text" label="Button Text" value={props.text || ''} onChange={(e) => updateComponentProp(selectedComponent.id, 'text', e.target.value)} />
                <InputField name="href" label="Button Link" value={props.href || ''} onChange={(e) => updateComponentProp(selectedComponent.id, 'href', e.target.value)} />
            </>;
        
        case 'CategoryGridCard':
            return <>
                <InputField name="supertitle" label="Supertitle" value={props.supertitle || ''} onChange={e => updateComponentProp(selectedComponent.id, 'supertitle', e.target.value)} />
                <InputField name="title" label="Title" value={props.title || ''} onChange={e => updateComponentProp(selectedComponent.id, 'title', e.target.value)} />
                <InputField name="subtitle" label="Subtitle" value={props.subtitle || ''} onChange={e => updateComponentProp(selectedComponent.id, 'subtitle', e.target.value)} />
                <InputField name="callToAction" label="Button Text" value={props.callToAction || ''} onChange={e => updateComponentProp(selectedComponent.id, 'callToAction', e.target.value)} />
                <InputField name="link" label="Link URL" value={props.link || ''} onChange={e => updateComponentProp(selectedComponent.id, 'link', e.target.value)} />
                <InputField name="imageUrl" label="Image URL" value={props.imageUrl || ''} onChange={e => updateComponentProp(selectedComponent.id, 'imageUrl', e.target.value)} />
                <InputField name="gridSpan" as="select" label="Grid Span" value={props.gridSpan || 1} onChange={e => updateComponentProp(selectedComponent.id, 'gridSpan', Number(e.target.value))}>
                    <option value={1}>1 Column</option>
                    <option value={2}>2 Columns</option>
                </InputField>
                <InputField name="backgroundColor" type="color" label="Background Color" value={props.backgroundColor || '#cccccc'} onChange={e => updateComponentProp(selectedComponent.id, 'backgroundColor', e.target.value)} />
            </>;
        
        case 'TopCategoryCard':
            return <>
                <InputField name="name" label="Category Name" value={props.name || ''} onChange={e => updateComponentProp(selectedComponent.id, 'name', e.target.value)} />
                <InputField name="itemCount" label="Item Count" type="number" value={props.itemCount || 0} onChange={e => updateComponentProp(selectedComponent.id, 'itemCount', Number(e.target.value))} />
                <InputField name="imageUrl" label="Image URL" value={props.imageUrl || ''} onChange={e => updateComponentProp(selectedComponent.id, 'imageUrl', e.target.value)} />
                <InputField name="link" label="Link (Category Name for Filter)" value={props.link || ''} onChange={e => updateComponentProp(selectedComponent.id, 'link', e.target.value)} />
                <InputField name="backgroundColor" label="Background Color" type="color" value={props.backgroundColor || '#f0f0f0'} onChange={e => updateComponentProp(selectedComponent.id, 'backgroundColor', e.target.value)} />
                <InputField name="textColor" label="Text Color" type="color" value={props.textColor || '#2C3E50'} onChange={e => updateComponentProp(selectedComponent.id, 'textColor', e.target.value)} />
            </>;
        
        case 'PromoGrid2':
            const renderCardEditor = (cardKey: 'card1' | 'card2' | 'card3' | 'card4') => {
                const cardData: PromoGrid2CardData = props[cardKey] || {};
                const updateCardProp = (propName: keyof PromoGrid2CardData, value: any) => {
                    const updatedCard = { ...cardData, [propName]: value };
                    updateComponentProp(selectedComponent.id, cardKey, updatedCard);
                };
                return (
                    <div className="space-y-3">
                        <InputField label="Tag" name="tag" value={cardData.tag || ''} onChange={e => updateCardProp('tag', e.target.value)} />
                        <InputField label="Title" name="title" value={cardData.title || ''} onChange={e => updateCardProp('title', e.target.value)} />
                        <InputField label="Subtitle" name="subtitle" value={cardData.subtitle || ''} onChange={e => updateCardProp('subtitle', e.target.value)} />
                        <InputField label="Text Color" name="textColor" type="color" value={cardData.textColor || '#000000'} onChange={e => updateCardProp('textColor', e.target.value)} />
                        <InputField label="Background Image URL" name="backgroundImage" value={cardData.backgroundImage || ''} onChange={e => updateCardProp('backgroundImage', e.target.value)} />
                        <InputField label="Background Color" name="backgroundColor" type="color" value={cardData.backgroundColor || '#FFFFFF'} onChange={e => updateCardProp('backgroundColor', e.target.value)} />
                        <InputField label="Button Text" name="buttonText" value={cardData.buttonText || ''} onChange={e => updateCardProp('buttonText', e.target.value)} />
                        <InputField label="Button Link" name="buttonLink" value={cardData.buttonLink || ''} onChange={e => updateCardProp('buttonLink', e.target.value)} />
                        <InputField label="Button Color" name="buttonColor" type="color" value={cardData.buttonColor || '#000000'} onChange={e => updateCardProp('buttonColor', e.target.value)} />
                        <InputField label="Button Text Color" name="buttonTextColor" type="color" value={cardData.buttonTextColor || '#FFFFFF'} onChange={e => updateCardProp('buttonTextColor', e.target.value)} />
                    </div>
                )
            };
            return (
                <div className="space-y-2">
                    <Accordion identifier="card1" title="Card 1 (Large Left)">{renderCardEditor('card1')}</Accordion>
                    <Accordion identifier="card2" title="Card 2 (Top Right)">{renderCardEditor('card2')}</Accordion>
                    <Accordion identifier="card3" title="Card 3 (Middle Right)">{renderCardEditor('card3')}</Accordion>
                    <Accordion identifier="card4" title="Card 4 (Bottom Right)">{renderCardEditor('card4')}</Accordion>
                </div>
            )

        case 'TabbedProductGrid':
            const tabs: TabbedProductGrid_Tab[] = props.tabs || [];
            const updateTabs = (newTabs: TabbedProductGrid_Tab[]) => {
                updateComponentProp(selectedComponent.id, 'tabs', newTabs);
            };

            const renderBannerEditor = (banner: TabbedProductGrid_Banner, onChange: (updatedBanner: TabbedProductGrid_Banner) => void) => (
                <div className="space-y-2">
                    <InputField label="Image URL" name="imageUrl" value={banner.imageUrl} onChange={e => onChange({ ...banner, imageUrl: e.target.value })} />
                    <InputField label="Link URL" name="link" value={banner.link} onChange={e => onChange({ ...banner, link: e.target.value })} />
                </div>
            );

            const renderTabEditor = (tab: TabbedProductGrid_Tab, onChange: (updatedTab: TabbedProductGrid_Tab) => void) => (
                <div>
                    <InputField label="Tab Name" name="name" value={tab.name} onChange={e => onChange({ ...tab, name: e.target.value })} />
                    <div className="mt-2 pl-2 border-l-2">
                        <h5 className="text-xs font-semibold mb-1">Banners</h5>
                        <ListItemEditor
                            items={tab.banners || []}
                            onUpdate={(newBanners) => onChange({ ...tab, banners: newBanners })}
                            renderItem={renderBannerEditor}
                            defaultItem={{ id_prefix: 'banner', imageUrl: 'https://placehold.co/400x400', link: '#' }}
                        />
                    </div>
                </div>
            );

            return (
                <div>
                    <div className="mt-4">
                        <h4 className="font-medium text-sm text-gray-600 dark:text-gray-300 mb-2">Tabs</h4>
                        <ListItemEditor
                            items={tabs}
                            onUpdate={updateTabs}
                            renderItem={renderTabEditor}
                            defaultItem={{ id_prefix: 'tab', name: 'New Tab', banners: [] }}
                        />
                    </div>
                </div>
            );
            
        // --- EXISTING SECTIONS ---
        case 'CtaSection':
            return (
                <>
                    <InputField name="title" label="Title" value={props.title || ''} onChange={(e) => updateComponentProp(selectedComponent.id, 'title', e.target.value)} />
                    <InputField name="subtitle" label="Subtitle" value={props.subtitle || ''} onChange={(e) => updateComponentProp(selectedComponent.id, 'subtitle', e.target.value)} />
                    <InputField name="buttonText" label="Button Text" value={props.buttonText || ''} onChange={(e) => updateComponentProp(selectedComponent.id, 'buttonText', e.target.value)} />
                    <InputField name="buttonLink" label="Button Link" value={props.buttonLink || ''} onChange={(e) => updateComponentProp(selectedComponent.id, 'buttonLink', e.target.value)} />
                </>
            );
        case 'TeamSection':
             return (
                 <ListItemEditor
                    items={props.teamMembers || []}
                    onUpdate={(newItems) => updateComponentProp(selectedComponent.id, 'teamMembers', newItems)}
                    defaultItem={{ id_prefix: 'tm', name: 'New Member', title: 'Job Title', imageUrl: 'https://placehold.co/400x400', socials: {} }}
                    renderItem={(item, onChange) => (
                        <div className="space-y-2">
                           <InputField name={`team_name_${item.id}`} label="Name" value={item.name} onChange={e => onChange({ ...item, name: e.target.value })} />
                           <InputField name={`team_title_${item.id}`} label="Title" value={item.title} onChange={e => onChange({ ...item, title: e.target.value })} />
                           <InputField name={`team_imageUrl_${item.id}`} label="Image URL" value={item.imageUrl} onChange={e => onChange({ ...item, imageUrl: e.target.value })} />
                        </div>
                    )}
                 />
            );
        case 'FaqSection':
             return (
                 <ListItemEditor
                    items={props.items || []}
                    onUpdate={(newItems) => updateComponentProp(selectedComponent.id, 'items', newItems)}
                    defaultItem={{ id_prefix: 'faq', question: 'New Question?', answer: 'New Answer.' }}
                    renderItem={(item, onChange) => (
                        <div className="space-y-2">
                           <InputField name={`faq_question_${item.id}`} label="Question" value={item.question} onChange={e => onChange({ ...item, question: e.target.value })} />
                           <InputField name={`faq_answer_${item.id}`} as="textarea" label="Answer" value={item.answer} onChange={e => onChange({ ...item, answer: e.target.value })} />
                        </div>
                    )}
                 />
            );
         case 'StatsCounterSection':
             return (
                 <ListItemEditor
                    items={props.stats || []}
                    onUpdate={(newItems) => updateComponentProp(selectedComponent.id, 'stats', newItems)}
                    defaultItem={{ id_prefix: 'stat', label: 'New Stat', value: 100 }}
                    renderItem={(item, onChange) => (
                        <div className="space-y-2">
                           <InputField name={`stat_label_${item.id}`} label="Label" value={item.label} onChange={e => onChange({ ...item, label: e.target.value })} />
                           <InputField name={`stat_value_${item.id}`} label="Value" type="number" value={item.value} onChange={e => onChange({ ...item, value: Number(e.target.value) })} />
                        </div>
                    )}
                 />
            );
        case 'ColumnsSection':
             return (
                <>
                    <InputField name="columnCount" as="select" label="Number of Columns" value={props.columnCount || 2} onChange={e => updateComponentProp(selectedComponent.id, 'columnCount', Number(e.target.value))}>
                        <option value={2}>Two</option>
                        <option value={3}>Three</option>
                        <option value={4}>Four</option>
                    </InputField>
                </>
             );
        case 'HeadingSection':
            return (
                 <>
                    <InputField name="text" label="Text" value={props.text || ''} onChange={e => updateComponentProp(selectedComponent.id, 'text', e.target.value)} />
                    <InputField name="level" as="select" label="Level" value={props.level || 'h2'} onChange={e => updateComponentProp(selectedComponent.id, 'level', e.target.value)}>
                        <option value="h1">H1 (Page Title)</option>
                        <option value="h2">H2 (Section Title)</option>
                        <option value="h3">H3 (Sub-heading)</option>
                    </InputField>
                     <InputField name="align" as="select" label="Alignment" value={props.align || 'center'} onChange={e => updateComponentProp(selectedComponent.id, 'align', e.target.value)}>
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                    </InputField>
                 </>
            );
        case 'RichTextSection':
            return <InputField name="html" as="textarea" rows={8} label="HTML Content" value={props.html || ''} onChange={e => updateComponentProp(selectedComponent.id, 'html', e.target.value)} />
        case 'ImageWithTextSection':
             return (
                 <>
                    <InputField name="title" label="Title" value={props.title || ''} onChange={e => updateComponentProp(selectedComponent.id, 'title', e.target.value)} />
                    <InputField name="text" as="textarea" label="Text" value={props.text || ''} onChange={e => updateComponentProp(selectedComponent.id, 'text', e.target.value)} />
                    <InputField name="imageUrl" label="Image URL" value={props.imageUrl || ''} onChange={e => updateComponentProp(selectedComponent.id, 'imageUrl', e.target.value)} />
                     <InputField name="imageSide" as="select" label="Image Side" value={props.imageSide || 'left'} onChange={e => updateComponentProp(selectedComponent.id, 'imageSide', e.target.value)}>
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                    </InputField>
                 </>
            );
        case 'PricingTableSection':
            return (
                 <ListItemEditor
                    items={props.plans || []}
                    onUpdate={(newItems) => updateComponentProp(selectedComponent.id, 'plans', newItems)}
                    defaultItem={{ id_prefix: 'plan', name: 'New Plan', price: '0', frequency: '/ mo', features: [], isFeatured: false }}
                    renderItem={(item, onChange) => (
                        <div className="space-y-2">
                           <InputField name={`plan_name_${item.id}`} label="Name" value={item.name} onChange={e => onChange({ ...item, name: e.target.value })} />
                           <InputField name={`plan_price_${item.id}`} label="Price" value={item.price} onChange={e => onChange({ ...item, price: e.target.value })} />
                           <InputField name={`plan_freq_${item.id}`} label="Frequency" value={item.frequency} onChange={e => onChange({ ...item, frequency: e.target.value })} />
                           <InputField name={`plan_features_${item.id}`} label="Features (comma-separated)" value={item.features.join(', ')} onChange={e => onChange({ ...item, features: e.target.value.split(',').map(f => f.trim()) })} />
                           <label className="flex items-center text-sm"><input type="checkbox" checked={item.isFeatured} onChange={e => onChange({ ...item, isFeatured: e.target.checked })} className="mr-2" /> Featured</label>
                        </div>
                    )}
                 />
            );
        case 'VideoEmbedSection':
            return <InputField name="url" label="YouTube/Vimeo URL" value={props.url || ''} onChange={e => updateComponentProp(selectedComponent.id, 'url', e.target.value)} />
        case 'GoogleMapSection':
            return <InputField name="embedUrl" label="Google Maps Embed URL" value={props.embedUrl || ''} onChange={e => updateComponentProp(selectedComponent.id, 'embedUrl', e.target.value)} />
        default:
            return <p className="text-xs text-gray-500">No specific properties to edit for this component type.</p>;
    }
  }

  const renderStylingEditors = () => {
    switch(selectedComponent.type) {
        case 'DividerSection':
            return (
                <>
                    <InputField name="space" label="Space (px)" type="number" value={props.space || 50} onChange={e => updateComponentProp(selectedComponent.id, 'space', Number(e.target.value))} />
                    <label className="flex items-center text-sm"><input type="checkbox" checked={props.showLine} onChange={e => updateComponentProp(selectedComponent.id, 'showLine', e.target.checked)} className="mr-2" /> Show Line</label>
                    {props.showLine && <InputField name="lineColor" label="Line Color" type="color" value={props.lineColor || '#E5E7EB'} onChange={e => updateComponentProp(selectedComponent.id, 'lineColor', e.target.value)} />}
                </>
            );
        case 'HeadingSection':
            return <InputField name="color" label="Text Color" type="color" value={props.color || '#000000'} onChange={e => updateComponentProp(selectedComponent.id, 'color', e.target.value)} />
        default:
            return (
                <InputField name="backgroundColor" label="Background Color" type="color" value={selectedComponent.styles?.backgroundColor?.toString() || '#FFFFFF'} onChange={e => updateComponentStyle(selectedComponent.id, 'backgroundColor', e.target.value)} />
            );
    }
  }

  return (
    <div className="p-4 space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Editing: {selectedComponent.name || selectedComponent.type}</h3>
        <p className="text-xs text-gray-500">ID: {selectedComponent.id}</p>
      </div>

      <div className="space-y-4">
         <h4 className="font-medium text-sm text-gray-600 dark:text-gray-300">Properties</h4>
         <InputField
            label="Section Name"
            name="sectionName"
            value={selectedComponent.name || ''}
            onChange={(e) => updateComponentName(selectedComponent.id, e.target.value)}
            helperText="A friendly name for the Structure panel."
          />
        {props && 'title' in props && typeof props.title === 'string' && (
          <InputField
            label="Section Title"
            name="title"
            value={props.title || ''}
            onChange={(e) => updateComponentProp(selectedComponent.id, 'title', e.target.value)}
          />
        )}
        {renderSpecificEditors()}
      </div>
      
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Styling</h3>
        <div className="space-y-4">
            {renderStylingEditors()}
        </div>
      </div>


      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => removeComponent(selectedComponent.id)}
          className="w-full flex items-center justify-center gap-2 text-sm text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/20 py-2 rounded-md transition-colors"
        >
          <TrashIcon className="w-4 h-4" />
          Delete Component
        </button>
      </div>
    </div>
  );
};

export default PropertyInspector;