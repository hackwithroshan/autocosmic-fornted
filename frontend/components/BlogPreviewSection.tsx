import React from 'react';
import { CmsPage, PageName } from '../types';

interface BlogPreviewSectionProps {
  posts: CmsPage[];
  navigateToPage: (page: PageName, data?: any) => void;
}

const BlogPreviewSection: React.FC<BlogPreviewSectionProps> = ({ posts, navigateToPage }) => {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-zaina-neutral-light dark:bg-dark-zaina-neutral-light" id="blog-preview">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading-cinzel font-bold text-center text-zaina-text-primary dark:text-dark-zaina-text-primary mb-10 md:mb-12">
          ZAINA Style Stories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {posts.map(post => (
            <div key={post.id} className="group bg-zaina-white dark:bg-dark-zaina-bg-card rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 focus-within:ring-2 focus-within:ring-zaina-primary">
              <button onClick={() => navigateToPage('blogPost', post)} className="w-full text-left h-full flex flex-col">
                {post.featuredImageUrl && (
                  <div className="aspect-video overflow-hidden"> 
                    <img src={post.featuredImageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </div>
                )}
                <div className="p-5 md:p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-heading-playfair font-semibold text-zaina-text-primary dark:text-dark-zaina-text-primary mb-2 group-hover:text-zaina-primary dark:group-hover:text-dark-zaina-primary transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-zaina-text-secondary dark:text-dark-zaina-text-secondary font-body-jost mb-4 line-clamp-3 flex-grow">{post.metaDescription || post.content.substring(0, 100)}</p>
                  <span className="mt-auto text-sm font-semibold text-zaina-primary dark:text-dark-zaina-primary group-hover:underline self-start">Read More &rarr;</span>
                </div>
              </button>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
            <button onClick={() => navigateToPage('blogIndex')} className="bg-zaina-primary text-zaina-white font-body-jost font-semibold py-3 px-8 rounded-lg hover:opacity-90 transition duration-300 transform hover:scale-105">
                Visit Our Blog
            </button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreviewSection;
