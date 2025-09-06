import React from 'react';
import { CmsPage } from '../../types';
import { sanitizeHTML } from '../utils/sanitizer';

interface BlogPostPageProps {
  post: CmsPage;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ post }) => {
  return (
    <div className="bg-zaina-white dark:bg-dark-zaina-bg-card min-h-screen py-10 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <article>
          <header className="mb-8 text-center">
            <h1 className="text-3xl md:text-5xl font-heading-playfair font-bold text-zaina-text-primary dark:text-dark-zaina-text-primary mb-4">
              {post.title}
            </h1>
            <p className="text-sm text-zaina-text-secondary dark:text-dark-zaina-text-secondary">
              Published on {new Date(post.lastUpdated).toLocaleDateString()} by {post.lastUpdatedBy}
            </p>
          </header>

          {post.featuredImageUrl && (
            <figure className="mb-8">
              <img src={post.featuredImageUrl} alt={post.title} className="w-full h-auto max-h-[500px] object-cover rounded-xl shadow-lg" />
            </figure>
          )}

          <div
            className="prose prose-lg lg:prose-xl max-w-none text-zaina-text-primary dark:text-dark-zaina-text-primary
                       prose-headings:font-heading-cormorant prose-headings:text-zaina-text-primary dark:prose-headings:text-dark-zaina-text-primary
                       prose-p:text-zaina-slate-gray dark:prose-p:text-dark-zaina-text-secondary prose-p:leading-relaxed
                       prose-strong:text-zaina-text-primary dark:prose-strong:text-dark-zaina-text-primary
                       prose-a:text-zaina-primary dark:prose-a:text-dark-zaina-primary hover:prose-a:underline
                       prose-li:marker:text-zaina-primary dark:prose-li:marker:text-dark-zaina-primary
                       prose-img:rounded-lg prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.content) }}
          />
        </article>
      </div>
      <style>{`
        .prose h2 { margin-top: 1.5em; margin-bottom: 0.8em; font-size: 1.5em; /* 24px */ }
        .prose h3 { margin-top: 1.25em; margin-bottom: 0.6em; font-size: 1.25em; /* 20px */ }
      `}</style>
    </div>
  );
};

export default BlogPostPage;
