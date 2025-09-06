
import React from 'react';
import { PolicyContent, ZainaColor } from '../../types';
import { sanitizeHTML } from '../utils/sanitizer';

interface PolicyPageProps {
  title: string;
  htmlContent?: string;
}

const PolicyPage: React.FC<PolicyPageProps> = ({ title, htmlContent }) => {
  return (
    <div className="bg-zaina-neutral-light dark:bg-dark-zaina-neutral-light min-h-screen py-10 md:py-16 font-body-jost">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <header className="mb-8 md:mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-heading-playfair font-bold text-zaina-text-primary dark:text-dark-zaina-text-primary">
            {title}
          </h1>
        </header>
        <article className="prose prose-lg max-w-none text-zaina-text-primary dark:text-dark-zaina-text-primary
                          prose-headings:font-heading-cormorant prose-headings:text-zaina-text-primary dark:prose-headings:text-dark-zaina-text-primary
                          prose-p:text-zaina-slate-gray dark:prose-p:text-dark-zaina-text-secondary prose-p:leading-relaxed
                          prose-strong:text-zaina-text-primary dark:prose-strong:text-dark-zaina-text-primary
                          prose-a:text-zaina-primary dark:prose-a:text-dark-zaina-primary prose-a:no-underline hover:prose-a:underline
                          prose-li:marker:text-zaina-primary dark:prose-li:marker:text-dark-zaina-primary
                          bg-zaina-white dark:bg-dark-zaina-bg-card p-6 md:p-8 rounded-lg shadow-lg">
          {htmlContent ? (
            <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(htmlContent) }} />
          ) : (
            <p>{"Content for this policy is currently being updated. Please check back soon."}</p>
          )}
        </article>
      </div>
      <style>{`
        .prose h2 { margin-top: 1.5em; margin-bottom: 0.8em; font-size: 1.5em; /* 24px */ }
        .prose h3 { margin-top: 1.25em; margin-bottom: 0.6em; font-size: 1.25em; /* 20px */ }
        .prose ul, .prose ol { margin-top: 1em; margin-bottom: 1em; padding-left: 1.5em; }
        .prose li { margin-top: 0.25em; margin-bottom: 0.25em; }
        .prose p { margin-bottom: 1em; }
        .prose strong { font-weight: 600; }
        .prose a { font-weight: 500; }
        .prose table { width: 100%; margin-top: 1.5em; margin-bottom: 1.5em; border-collapse: collapse; }
        .prose th, .prose td { border: 1px solid #E9ECEF; padding: 0.5em 0.75em; text-align: left; } /* zaina-neutral-medium */
        html.dark .prose th, html.dark .prose td { border: 1px solid #34495E; }
        .prose thead { background-color: #DAE7F3; } /* zaina-sky-blue-light */
        html.dark .prose thead { background-color: #2A4B6D; } /* dark:zaina-sky-blue-light */
        .prose thead th { font-weight: 600; }
      `}</style>
    </div>
  );
};

export default PolicyPage;