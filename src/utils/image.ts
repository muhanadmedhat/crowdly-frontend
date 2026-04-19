/**
 * Optimizes an image URL for performance.
 * If it's a Cloudinary URL, it adds transformation parameters.
 */
export const optimizeImage = (url?: string, width: number = 800): string => {
  if (!url) return '';

  // Cloudinary optimization
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    const parts = url.split('/upload/');
    // f_auto: automatic format (WebP/AVIF if supported)
    // q_auto: automatic quality
    // w_{width}: specific width
    // c_fill: aspect ratio filling
    return `${parts[0]}/upload/c_fill,g_auto,w_${width},q_auto,f_auto/${parts[1]}`;
  }

  return url;
};

/**
 * Extracts the best available image URL from a project object.
 */
export const getProjectImage = (project: any): string | undefined => {
  if (!project) return undefined;

  // Prioritize direct image fields
  const directImage = project.image || project.cover_image || project.featured_image;
  if (directImage && typeof directImage === 'string') return directImage;

  // Handle images array
  const images = project.images || project.cover_images || [];
  if (Array.isArray(images) && images.length > 0) {
    const firstImg = images[0];
    return firstImg.image_url || firstImg.image || (typeof firstImg === 'string' ? firstImg : undefined);
  }

  return undefined;
};
