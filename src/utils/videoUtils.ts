
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
  // Check if it's an embed code (contains iframe)
  if (url.includes('<iframe') || url.includes('iframe>')) return true;
  
  // Check domain for common video services
  try {
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
  } catch {
    // If URL parsing fails but contains iframe, treat as embed code
    return url.includes('<iframe') || url.includes('iframe>');
  }
};

/**
 * Validates a video URL
 */
export const validateVideoUrl = (url: string): boolean => {
  if (!url.trim()) return false;
  
  // Check if it's an embed code
  if (url.includes('<iframe') && url.includes('iframe>')) return true;
  
  // Check if it's a HeyGen partial embed (just the src part)
  if (url.includes('heygen.com/embed/') && !url.startsWith('http')) {
    return true;
  }
  
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
    // If it's not a valid URL, check if it's potentially an embed code
    return url.includes('iframe') && url.includes('src=');
  }
};

/**
 * Extract the src URL from an iframe embed code
 */
export const extractSrcFromEmbedCode = (embedCode: string): string => {
  // HeyGen specific handling - don't try to extract, just return empty
  // to trigger the raw HTML rendering approach for HeyGen
  if (embedCode.includes('heygen.com')) {
    console.log("HeyGen embed code detected, using raw HTML approach");
    return ''; // Will use rawHtml instead
  }
  
  // Use regex to match src attribute in iframe tag
  const srcMatch = embedCode.match(/src=["'](.*?)["']/i);
  
  if (!srcMatch || !srcMatch[1]) {
    console.error("Failed to extract src from embed code:", embedCode);
    return '';
  }
  
  // Get the URL from the match
  let src = srcMatch[1];
  
  // If the URL is relative (starts with //), add https:
  if (src.startsWith('//')) {
    src = 'https:' + src;
  }
  
  console.log("Extracted embed source:", src);
  return src;
};

/**
 * Cleans up and standardizes an iframe embed code
 */
export const cleanUpEmbedCode = (embedCode: string): string => {
  // If it's only a URL from HeyGen that contains embed
  if (embedCode.includes('heygen.com/embed/') && !embedCode.includes('<iframe')) {
    return `<iframe src="${embedCode}" width="600" height="340" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
  }
  
  // If it's already an iframe, return as is
  if (embedCode.includes('<iframe') && embedCode.includes('</iframe>')) {
    return embedCode;
  }
  
  // Handle HeyGen embed code that might be missing closing tag
  if (embedCode.includes('<iframe') && embedCode.includes('heygen.com')) {
    if (!embedCode.includes('</iframe>')) {
      return embedCode + '</iframe>';
    }
    return embedCode; // HeyGen iframe with closing tag
  }
  
  return embedCode;
};

/**
 * Converts regular video service URLs to their embed versions
 */
export const getEmbedUrl = (url: string): string => {
  // Special handling for HeyGen
  if (url.includes('heygen.com')) {
    console.log("HeyGen URL detected, returning as is for special handling");
    return url;
  }
  
  // If it's already an iframe with src, extract and return that src
  if (url.includes('<iframe') && url.includes('src=')) {
    return extractSrcFromEmbedCode(url);
  }
  
  // Otherwise, process the URL to convert it to an embed URL
  try {
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
  } catch (error) {
    console.error("Error processing URL:", error);
    return url;
  }
};

/**
 * Checks if a URL or embed code is specifically for HeyGen
 */
export const isHeyGenVideo = (url: string): boolean => {
  return url.includes('heygen.com');
};

/**
 * Checks if a HeyGen URL has a complete iframe code
 */
export const hasCompleteHeyGenEmbed = (url: string): boolean => {
  return url.includes('heygen.com') && url.includes('<iframe') && url.includes('</iframe>');
};
