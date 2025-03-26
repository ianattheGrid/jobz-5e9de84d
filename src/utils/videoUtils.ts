
/**
 * Utilities for handling video display and processing
 */

import { extractDomain } from "./validationUtils";

/**
 * Detects and returns the appropriate video format based on URL
 */
export const detectVideoFormat = (url: string): string => {
  if (url.includes('.mp4')) return 'video/mp4';
  if (url.includes('.webm')) return 'video/webm';
  if (url.includes('.ogg')) return 'video/ogg';
  if (url.includes('.mov')) return 'video/quicktime';
  
  // Default to MP4 for unknown formats
  return 'video/mp4';
};

/**
 * Determines if a URL should be treated as an embedded video (iframe)
 * rather than a direct video file
 */
export const isEmbeddedVideoUrl = (url: string): boolean => {
  // Check domain for common video services
  const domain = extractDomain(url);
  
  const videoServices = [
    'heygen', 'vimeo', 'youtube', 'youtu.be', 'loom', 
    'wistia', 'vidyard', 'streamable', 'dailymotion'
  ];
  
  const isVideoService = videoServices.some(service => domain.includes(service));
  
  // Direct video file extensions
  const isVideoFile = 
    url.endsWith('.mp4') || 
    url.endsWith('.webm') || 
    url.endsWith('.mov') || 
    url.endsWith('.ogg');
  
  // If it's a video service but doesn't have a video extension, it should be embedded
  return isVideoService && !isVideoFile;
};

/**
 * Validates a video URL
 */
export const validateVideoUrl = (url: string): boolean => {
  if (!url.trim()) return false;
  
  // Basic URL validation
  try {
    new URL(url);
    const domain = extractDomain(url);
    
    // Check for video services
    const isVideoService = [
      'heygen', 'vimeo', 'youtube', 'youtu.be', 'loom',
      'wistia', 'vidyard', 'streamable', 'dailymotion'
    ].some(service => domain.includes(service));
    
    // Direct video file check
    const isVideoFile = 
      url.includes('.mp4') || 
      url.includes('.webm') || 
      url.includes('.mov') || 
      url.includes('.ogg');
    
    return isVideoService || isVideoFile || url.includes('/videos/') || url.includes('video') || url.includes('media');
  } catch {
    return false;
  }
};

/**
 * Converts regular video service URLs to their embed versions
 */
export const getEmbedUrl = (url: string): string => {
  const domain = extractDomain(url);
  
  // Handle different video services
  if (domain.includes('youtube') || domain.includes('youtu.be')) {
    // Convert YouTube watch URLs to embed URLs
    const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return ytMatch ? `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1` : url;
  } else if (domain.includes('vimeo')) {
    // Convert Vimeo URLs to embed URLs
    const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)(?:$|\/|\?)/);
    return vimeoMatch ? `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1` : url;
  } else if (domain.includes('heygen')) {
    // For HeyGen, check if it already contains embed or not
    if (url.includes('/embed/')) {
      return url;
    } else if (url.includes('/watch/')) {
      // Try to convert watch URL to embed URL
      return url.replace('/watch/', '/embed/');
    }
    return url;
  } else if (domain.includes('loom')) {
    // Convert Loom URLs to embed URLs
    return url.includes('/embed/') ? url : url.replace('/share/', '/embed/');
  }
  
  // Default case, just use the URL as is
  return url;
};

