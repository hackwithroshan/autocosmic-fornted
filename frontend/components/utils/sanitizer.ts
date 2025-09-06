/**
 * A simple (and naive) HTML sanitizer for demonstration purposes.
 * In a real-world application, use a robust, well-tested library like DOMPurify.
 * This function removes <script> tags to prevent basic XSS attacks.
 * @param dirty - The potentially unsafe HTML string.
 * @returns A cleaner HTML string.
 */
export const sanitizeHTML = (dirty: string): string => {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }
  // Remove script tags and their content
  const clean = dirty.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/g, '');
  // A more robust solution would also handle onload attributes, etc.
  return clean;
};
