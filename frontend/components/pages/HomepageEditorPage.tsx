

import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { HomepageSection, Product, HeroSlide, Testimonial, ShoppableVideo, OccasionContent, CmsPage, PageName, CategoryGridItem, TopCategoryItem, TeamMember, StatItem, FaqItem, PricingPlan, SectionType, PromoGrid2CardData } from '../../types';
import PageBuilder from '../PageBuilder';
import { INITIAL_HOMEPAGE_LAYOUT } from '../../App'; // Using initial layout as a fallback
import { API_BASE_URL } from '../../constants';

// Import section components for rendering the canvas
import HeroSlider from '../HeroSlider';
import ProductGrid from '../ProductGrid';
import TestimonialsSlider from '../TestimonialsSlider';
import TrendingProductStrip from '../TrendingProductStrip';
import ShoppableVideoCarouselSection from '../ShoppableVideoCarouselSection';
import ShopByOccasion from '../ShopByOccasion';
import InstagramBanner from '../InstagramBanner';
import BlogPreviewSection from '../BlogPreviewSection';
import CategoryGrid from '../CategoryGrid';
import TopCategories from '../TopCategories';
import SelectableWrapper from '../SelectableWrapper';
import CtaSection from '../CtaSection';
import TeamSection from '../TeamSection';
import FaqSection from '../FaqSection';
import StatsCounterSection from '../StatsCounterSection';
import DividerSection from '../DividerSection';
import ColumnsSection from '../ColumnsSection';
import HeadingSection from '../HeadingSection';
import RichTextSection from '../RichTextSection';
import ImageWithTextSection from '../ImageWithTextSection';
import PricingTableSection from '../PricingTableSection';
import VideoEmbedSection from '../VideoEmbedSection';
import GoogleMapSection from '../GoogleMapSection';
import ColumnComponent from '../ColumnComponent';
import ElementHeading from '../elements/ElementHeading';
import ElementText from '../elements/ElementText';
import ElementImage from '../elements/ElementImage';
import ElementButton from '../elements/ElementButton';
import CategoryGridCard from '../CategoryGridCard';
import TopCategoryCard from '../TopCategoryCard';
import PromoGrid2 from '../PromoGrid2';
import TabbedProductGrid from '../TabbedProductGrid';


interface HomepageEditorPageProps {
  products: Product[];
  heroSlides: HeroSlide[];
  testimonials: Testimonial[];
  shoppableVideos: ShoppableVideo[];
  occasions: OccasionContent[];
  cmsPages: CmsPage[];
  categoryGridItems: CategoryGridItem[];
  topCategories: TopCategoryItem[];
  teamMembers: TeamMember[];
  stats: StatItem[];
  faqItems: FaqItem[];
  pricingPlans: PricingPlan[];
  navigateToPage: (page: PageName, data?: any) => void;
}

const HomepageEditorPage: React.FC<HomepageEditorPageProps> = (props) => {
  const [history, setHistory] = useState<HomepageSection[][]>([INITIAL_HOMEPAGE_LAYOUT]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  
  // Drag and Drop State
  const [draggedItem, setDraggedItem] = useState<HomepageSection | { type: SectionType; [key: string]: any } | null>(null);
  const [draggedFrom, setDraggedFrom] = useState<{ parentId: string | null; index: number } | 'library' | null>(null);
  const [dropTarget, setDropTarget] = useState<{ parentId: string | null; index: number } | null>(null);

  const homepageLayout = history[historyIndex];
  
    const updateLayout = (updaterFn: (prevLayout: HomepageSection[]) => HomepageSection[]) => {
        const updatedLayout = updaterFn(homepageLayout);
        const newHistory = history.slice(0, historyIndex + 1);
        setHistory([...newHistory, updatedLayout]);
        setHistoryIndex(newHistory.length);
    };
  
    const setLayout = (newLayout: HomepageSection[] | ((prev: HomepageSection[]) => HomepageSection[])) => {
        if (typeof newLayout === 'function') {
            updateLayout(newLayout);
        } else {
            updateLayout(() => newLayout);
        }
    };
  
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
    }
  };


  const fetchHomepageLayout = useCallback(async () => {
    try {
      const token = localStorage.getItem('zaina-authToken');
      if (!token) {
        setHistory([INITIAL_HOMEPAGE_LAYOUT]);
        setHistoryIndex(0);
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/admin/content/homepage-layout`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.layout) {
        setHistory([response.data.layout]);
        setHistoryIndex(0);
      } else {
        setHistory([INITIAL_HOMEPAGE_LAYOUT]);
        setHistoryIndex(0);
      }
    } catch (error) {
      console.error("Failed to fetch homepage layout for editor, using default.", error);
      setHistory([INITIAL_HOMEPAGE_LAYOUT]);
      setHistoryIndex(0);
    }
  }, []);

  useEffect(() => {
    fetchHomepageLayout();
  }, [fetchHomepageLayout]);

  const handleSaveLayout = async () => {
    try {
      const token = localStorage.getItem('zaina-authToken');
      await axios.put(`${API_BASE_URL}/admin/content/homepage-layout`, 
        { layout: homepageLayout },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Homepage layout saved successfully!");
    } catch (error) {
      console.error("Failed to save homepage layout", error);
      alert("Error: Could not save layout to the server.");
    }
  };
  
  const findAndRemoveNode = (nodes: HomepageSection[], id: string): [HomepageSection[], HomepageSection | null] => {
    let foundNode: HomepageSection | null = null;
    const newNodes = nodes.filter(node => {
        if (node.id === id) {
            foundNode = node;
            return false;
        }
        return true;
    }).map(node => {
        if (node.children && !foundNode) {
            const [newChildren, childNode] = findAndRemoveNode(node.children, id);
            if (childNode) {
                foundNode = childNode;
                return { ...node, children: newChildren };
            }
        }
        return node;
    });
    return [newNodes, foundNode];
  };

  const findAndInsertNode = (nodes: HomepageSection[], targetParentId: string | null, targetIndex: number, nodeToInsert: HomepageSection): HomepageSection[] => {
    if (targetParentId === null) {
      const newLayout = [...nodes];
      newLayout.splice(targetIndex, 0, nodeToInsert);
      return newLayout;
    }

    return nodes.map(node => {
      if (node.id === targetParentId) {
        const newChildren = [...(node.children || [])];
        newChildren.splice(targetIndex, 0, nodeToInsert);
        return { ...node, children: newChildren };
      }
      if (node.children) {
        return { ...node, children: findAndInsertNode(node.children, targetParentId, targetIndex, nodeToInsert) };
      }
      return node;
    });
  };

  const handleDrop = (targetParentId: string | null, targetIndex: number) => {
    if (!draggedItem) return;

    updateLayout(prevLayout => {
        let layoutAfterRemoval = prevLayout;
        let itemToMove: HomepageSection | null = null;

        if (draggedFrom !== 'library') {
            const [newLayout, foundNode] = findAndRemoveNode(prevLayout, (draggedItem as HomepageSection).id);
            layoutAfterRemoval = newLayout;
            itemToMove = foundNode;
        } else {
            itemToMove = { 
                ...draggedItem, 
                id: `${(draggedItem.type || 'comp').toLowerCase()}-${Date.now()}` 
            } as HomepageSection;
            if (itemToMove.children) {
                const addIds = (nodes: HomepageSection[]): HomepageSection[] => {
                    return nodes.map(n => ({...n, id: `${n.type.toLowerCase()}-${Date.now()}-${Math.random()}`, children: n.children ? addIds(n.children) : undefined}));
                }
                itemToMove.children = addIds(itemToMove.children);
            }
        }

        if (itemToMove) {
            return findAndInsertNode(layoutAfterRemoval, targetParentId, targetIndex, itemToMove);
        }
        return prevLayout;
    });
  };

  const handleDragEnd = () => {
      setDraggedItem(null);
      setDraggedFrom(null);
      setDropTarget(null);
  };

  const removeNode = (id: string) => {
    updateLayout(prevLayout => {
      const [newLayout] = findAndRemoveNode(prevLayout, id);
      return newLayout;
    });
    setSelectedComponentId(null);
  };
  
  const handleMove = (id: string, direction: 'up' | 'down') => {
    setLayout(prevLayout => {
        const newLayout = JSON.parse(JSON.stringify(prevLayout)); // Deep copy for mutation

        const moveItemInArray = (array: HomepageSection[], fromIndex: number, toIndex: number) => {
            const element = array.splice(fromIndex, 1)[0];
            array.splice(toIndex, 0, element);
        };

        // Recursive function to find the item in any nested children array
        const findAndMove = (nodes: HomepageSection[]): boolean => {
            const index = nodes.findIndex(node => node.id === id);
            
            // Item found in the current array
            if (index !== -1) {
                const newIndex = direction === 'up' ? index - 1 : index + 1;
                if (newIndex >= 0 && newIndex < nodes.length) {
                    moveItemInArray(nodes, index, newIndex);
                    return true; // Move was successful
                }
                return false; // Can't move further
            }

            // Item not in this array, search in children
            for (const node of nodes) {
                if (node.children) {
                    if (findAndMove(node.children)) {
                        return true; // Move was successful in a deeper level
                    }
                }
            }
            
            return false; // Not found at this level or any deeper
        };

        findAndMove(newLayout);
        return newLayout;
    });
  };


  const handleMoveUp = (id: string) => handleMove(id, 'up');
  const handleMoveDown = (id: string) => handleMove(id, 'down');


  const renderNode = (node: HomepageSection, path: string): React.ReactNode => {
    const Component = {
        HeroSlider, CategoryGrid, TopCategories, TrendingProductStrip,
        ShoppableVideoCarouselSection, ProductGrid, ShopByOccasion, TestimonialsSlider,
        BlogPreviewSection, InstagramBanner, CtaSection, TeamSection, FaqSection,
        StatsCounterSection, DividerSection, ColumnsSection, HeadingSection, RichTextSection,
        ImageWithTextSection, PricingTableSection, VideoEmbedSection, GoogleMapSection,
        Column: ColumnComponent,
        Element_Heading: ElementHeading,
        Element_Text: ElementText,
        Element_Image: ElementImage,
        Element_Button: ElementButton,
        CategoryGridCard,
        TopCategoryCard,
        PromoGrid2,
        TabbedProductGrid,
    }[node.type];

    if (!Component) {
        return <div key={node.id} className="text-center p-4 bg-red-100">Unknown Section Type: {node.type}</div>;
    }

    const componentProps: any = {
        ...node.props,
        ...(node.type === 'HeroSlider' && { slides: props.heroSlides }),
        ...(node.type === 'TrendingProductStrip' && { products: props.products.filter(p => p.isNew) }),
        ...(node.type === 'ProductGrid' && { products: props.products.filter(p => p.isBestSeller) }),
        ...(node.type === 'ShoppableVideoCarouselSection' && { videos: props.shoppableVideos, allProducts: props.products }),
        ...(node.type === 'ShopByOccasion' && { occasions: props.occasions, onOccasionSelect: () => {} }),
        ...(node.type === 'TestimonialsSlider' && { testimonials: props.testimonials }),
        ...(node.type === 'BlogPreviewSection' && { posts: props.cmsPages.filter(p => p.type === 'post').slice(0,3), navigateToPage: props.navigateToPage }),
        ...(node.type === 'TeamSection' && { teamMembers: props.teamMembers }),
        ...(node.type === 'FaqSection' && { items: props.faqItems }),
        ...(node.type === 'StatsCounterSection' && { stats: props.stats }),
        ...(node.type === 'PricingTableSection' && { plans: props.pricingPlans }),
        ...(node.type === 'TabbedProductGrid' && { tabs: node.props?.tabs || [] }),
        children: node.children ? node.children.map((child, i) => renderNode(child, `${path}.children[${i}]`)) : undefined,
        // Pass drop handlers to container components
        parentId: node.id,
        onDrop: handleDrop,
        setDropTarget: setDropTarget,
    };

    return (
        <SelectableWrapper
            key={node.id}
            id={node.id}
            isSelected={selectedComponentId === node.id}
            onClick={setSelectedComponentId}
            onRemove={() => removeNode(node.id)}
            onMoveUp={() => handleMoveUp(node.id)}
            onMoveDown={() => handleMoveDown(node.id)}
            styles={node.styles}
            onDragStart={() => {
              setDraggedItem(node);
              const { parent } = findNodeAndParent(homepageLayout, node.id);
              const parentChildren = parent ? parent.children : homepageLayout;
              const index = parentChildren?.findIndex(n => n.id === node.id) || 0;
              setDraggedFrom({ parentId: parent ? parent.id : null, index });
            }}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            setDropTarget={setDropTarget}
            dropTarget={dropTarget}
            path={path}
            draggedItem={draggedItem}
        >
            <Component {...componentProps} />
        </SelectableWrapper>
    );
  };
  
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


  return (
    <PageBuilder
      layout={homepageLayout}
      setLayout={setLayout as any}
      selectedComponentId={selectedComponentId}
      setSelectedComponentId={setSelectedComponentId}
      onClose={() => props.navigateToPage('adminDashboard', { section: 'dashboard' })}
      onSave={handleSaveLayout}
      undo={undo}
      redo={redo}
      canUndo={historyIndex > 0}
      canRedo={historyIndex < history.length - 1}
      onStructureDragStart={() => {}}
      onStructureDrop={() => {}}
      onDragEnd={handleDragEnd}
      setDraggedItem={setDraggedItem}
      setDraggedFrom={setDraggedFrom}
    >
        <div 
          className="min-h-full"
          onDragOver={(e) => {
            e.preventDefault();
            if (homepageLayout.length === 0) {
              setDropTarget({ parentId: null, index: 0 });
            } else {
              const lastEl = e.currentTarget.lastElementChild;
              if (lastEl) {
                  const rect = lastEl.getBoundingClientRect();
                  if (e.clientY > rect.top + rect.height / 2) {
                       setDropTarget({ parentId: null, index: homepageLayout.length });
                  }
              }
            }
          }}
          onDragLeave={() => {
              setDropTarget(null);
          }}
          onDrop={(e) => {
            e.stopPropagation();
            if (dropTarget) {
              handleDrop(dropTarget.parentId, dropTarget.index);
            }
          }}
        >
          {homepageLayout.map((section, index) => renderNode(section, `layout[${index}]`))}
          {dropTarget && dropTarget.parentId === null && dropTarget.index === homepageLayout.length && <div className="h-1 bg-blue-500 my-2"></div>}
        </div>
    </PageBuilder>
  );
};

export default HomepageEditorPage;