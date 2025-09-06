import React from 'react';
import { CmsPage, PageName } from '../../types';

interface BlogIndexPageProps {
  posts: CmsPage[];
  navigateToPage: (page: PageName, data?: any) => void;
}

const BlogIndexPage: React.FC<BlogIndexPageProps> = ({ posts, navigateToPage }) => {
  return (
    <div className="bg-zaina-neutral-light dark:bg-dark-zaina-neutral-light min-h-screen py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading-playfair font-bold text-zaina-text-primary dark:text-dark-zaina-text-primary">ZAINA Style Stories</h1>
          <p className="mt-4 text-lg text-zaina-text-secondary dark:text-dark-zaina-text-secondary">Your source for fashion inspiration, tips, and behind-the-scenes stories.</p>
        </header>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <div key={post.id} className="group bg-zaina-white dark:bg-dark-zaina-bg-card rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 focus-within:ring-2 focus-within:ring-zaina-primary">
                <button
                  onClick={() => navigateToPage('blogPost', post)}
                  className="block w-full text-left h-full flex flex-col"
                >
                  {post.featuredImageUrl && (
                    <div className="aspect-video overflow-hidden">
                      <img src={post.featuredImageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    </div>
                  )}
                  <div className="p-5 md:p-6 flex flex-col flex-grow">
                    <h2 className="text-lg font-heading-playfair font-semibold text-zaina-text-primary dark:text-dark-zaina-text-primary mb-2 group-hover:text-zaina-primary dark:group-hover:text-dark-zaina-primary transition-colors line-clamp-2">{post.title}</h2>
                    <p className="text-sm text-zaina-text-secondary dark:text-dark-zaina-text-secondary font-body-jost mb-4 line-clamp-3 flex-grow">{post.metaDescription}</p>
                    <div className="mt-auto flex items-center justify-between text-xs text-zaina-text-secondary dark:text-dark-zaina-text-secondary">
                      <span>{new Date(post.lastUpdated).toLocaleDateString()}</span>
                      <span className="font-semibold text-zaina-primary dark:text-dark-zaina-primary group-hover:underline">Read More &rarr;</span>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-zaina-text-secondary dark:text-dark-zaina-text-secondary">No blog posts have been published yet. Check back soon!</p>
        )}
      </div>
    </div>
  );
};

export default BlogIndexPage;
