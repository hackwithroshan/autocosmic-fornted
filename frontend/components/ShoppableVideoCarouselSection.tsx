
import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import { ShoppableVideo, Product, ZainaColor, ProductVariant } from '../types';
import PlayCircleIcon from './icons/PlayCircleIcon'; 
import ShoppingCartIcon from './icons/ShoppingCartIcon';
import CloseIcon from './icons/CloseIcon'; 

// --- VideoCard Component ---
interface VideoCardProps {
  video: ShoppableVideo;
  onClick: (video: ShoppableVideo) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  return (
    <div
      className="group relative aspect-[9/16] w-full bg-zaina-neutral-medium dark:bg-dark-zaina-neutral-medium rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105"
      onClick={() => onClick(video)}
      role="button"
      aria-label={`Play video: ${video.title}`}
    >
      <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
      <div className="absolute inset-0 flex flex-col justify-between p-3 text-zaina-white">
        <div className="self-center mt-auto mb-auto opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
            <PlayCircleIcon className="w-10 h-10 text-zaina-white/80 group-hover:text-zaina-white" />
        </div>
        <div>
          <h3 className="font-semibold text-sm line-clamp-2 mb-0.5">{video.title}</h3>
          {video.tag && <p className="text-xs opacity-80 line-clamp-1">{video.tag}</p>}
        </div>
      </div>
    </div>
  );
};

// --- VideoPlayerModal Component ---
interface VideoPlayerModalProps {
  video: ShoppableVideo | null;
  allProducts: Product[];
  isOpen: boolean;
  onClose: () => void;
  onQuickShop: (product: Product) => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, allProducts, isOpen, onClose, onQuickShop }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!isOpen || !video) return null;

  const featuredProducts = allProducts.filter(p => video.featuredProductIds.includes(p.id));

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-[103] p-2 sm:p-4 transition-opacity duration-300 ease-in-out"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
    >
      <div
        className="bg-zaina-white dark:bg-dark-zaina-bg-card rounded-lg shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col md:flex-row relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 md:top-3 md:right-3 text-zaina-text-secondary dark:text-dark-zaina-text-secondary hover:text-zaina-primary dark:hover:text-dark-zaina-primary z-20 bg-zaina-white/70 dark:bg-dark-zaina-bg-card/70 rounded-full p-1"
          aria-label="Close video player"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        {/* Video Player Area */}
        <div className="w-full md:w-2/3 aspect-video md:aspect-auto bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            src={video.videoUrl}
            poster={video.thumbnailUrl}
            controls
            autoPlay
            muted
            loop
            controlsList="nodownload"
            disablePictureInPicture
            onContextMenu={(e) => e.preventDefault()}
            className="w-full h-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Shoppable Sidebar Area */}
        <div className="w-full md:w-1/3 bg-zaina-neutral-light dark:bg-dark-zaina-neutral-medium p-4 flex flex-col overflow-y-auto max-h-[50vh] md:max-h-full">
          <h3 id="video-modal-title" className="text-lg font-semibold text-zaina-text-primary dark:text-dark-zaina-text-primary mb-1">{video.title}</h3>
          {video.tag && <p className="text-xs text-zaina-text-secondary dark:text-dark-zaina-text-secondary mb-3">{video.tag}</p>}
          
          {featuredProducts.length > 0 ? (
            <div className="space-y-3">
              {featuredProducts.map(product => (
                <div key={product.id} className="flex items-start p-2 bg-zaina-white dark:bg-dark-zaina-bg-card rounded-md shadow-sm">
                  <img src={product.imageUrl} alt={product.name} className="w-16 h-20 object-cover rounded-sm mr-3 flex-shrink-0" />
                  <div className="flex-grow">
                    <h4 className="text-xs font-medium text-zaina-text-primary dark:text-dark-zaina-text-primary line-clamp-2">{product.name}</h4>
                    <div className="text-xs my-0.5">
                      <span className="font-bold text-zaina-gold dark:text-zaina-gold">₹{product.price.toFixed(2)}</span>
                      {product.mrp > product.price && (
                        <span className="line-through text-zaina-text-secondary dark:text-dark-zaina-text-secondary ml-1.5">₹{product.mrp.toFixed(2)}</span>
                      )}
                    </div>
                    <button
                      onClick={() => onQuickShop(product)}
                      className="mt-1 w-full bg-zaina-primary dark:bg-dark-zaina-primary text-zaina-white dark:text-dark-zaina-text-primary text-[10px] font-semibold py-1 px-2 rounded hover:opacity-90 transition-opacity"
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zaina-text-secondary dark:text-dark-zaina-text-secondary text-center py-10">No products featured in this video.</p>
          )}
        </div>
      </div>
    </div>
  );
};


// --- Main Section Component ---
interface ShoppableVideoCarouselSectionProps {
  videos: ShoppableVideo[];
  allProducts: Product[];
  onQuickShop: (product: Product) => void;
}

const ShoppableVideoCarouselSection: React.FC<ShoppableVideoCarouselSectionProps> = ({ videos, allProducts, onQuickShop }) => {
  const [selectedVideo, setSelectedVideo] = useState<ShoppableVideo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVideoCardClick = (video: ShoppableVideo) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
    document.body.style.overflow = 'auto';
  };

  if (!videos || videos.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-zaina-sky-blue-light dark:bg-dark-zaina-sky-blue-light" id="zainagram">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading-cinzel font-bold text-center text-zaina-text-primary dark:text-dark-zaina-text-primary mb-10 md:mb-12">
          #ZainaGram
        </h2>
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          spaceBetween={16}
          slidesPerView={1.5}
          navigation
          pagination={{ clickable: true, dynamicBullets: true }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
            1280: { slidesPerView: 5, spaceBetween: 24 },
          }}
          className="pb-10" // For pagination dots
        >
          {videos.map((video) => (
            <SwiperSlide key={video.id}>
              <VideoCard video={video} onClick={handleVideoCardClick} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <VideoPlayerModal
        video={selectedVideo}
        allProducts={allProducts}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onQuickShop={onQuickShop}
      />
    </section>
  );
};

export default ShoppableVideoCarouselSection;
