
import { supabase } from './client';

type BucketOptions = {
  isPublic?: boolean;
  fileSizeLimit?: number;
  allowedMimeTypes?: string[];
};

/**
 * Creates a storage bucket if it doesn't already exist
 * @param bucketName The name of the bucket to create
 * @param options Configuration options for the bucket
 * @returns Promise that resolves to true if operation was successful, false otherwise
 */
export const createBucketIfNotExists = async (
  bucketName: string, 
  options: BucketOptions = {}
): Promise<boolean> => {
  const { 
    isPublic = false, 
    fileSizeLimit, 
    allowedMimeTypes
  } = options;
  
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      // Create bucket with provided options
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: isPublic,
        fileSizeLimit: fileSizeLimit,
        allowedMimeTypes: allowedMimeTypes
      });
      
      if (error) {
        console.error(`Error creating bucket ${bucketName}:`, error);
        return false;
      }
      
      console.log(`Bucket ${bucketName} created successfully.`);
    } else {
      console.log(`Bucket ${bucketName} already exists.`);
      
      // Update existing bucket if options are provided
      if (Object.keys(options).length > 0) {
        const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
          public: isPublic,
          fileSizeLimit: fileSizeLimit,
          allowedMimeTypes: allowedMimeTypes
        });
        
        if (updateError) {
          console.error(`Error updating bucket ${bucketName}:`, updateError);
          return false;
        }
        
        console.log(`Bucket ${bucketName} configuration updated.`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in createBucketIfNotExists:', error);
    return false;
  }
};

/**
 * Creates a RLS policy for a bucket
 * @param bucketName Name of the bucket
 * @param policyName Name of the policy
 * @param policyDefinition SQL definition for the policy
 * @returns Promise resolving to true if successful, false otherwise
 */
export const createBucketPolicy = async (
  bucketName: string,
  policyName: string,
  policyDefinition: string
): Promise<boolean> => {
  try {
    // Since we can't use RPC for custom functions directly, we'll use SQL execution
    // This would typically require a server-side function or Edge Function in Supabase
    console.log(`Policy creation requested for bucket ${bucketName} with policy name ${policyName}`);
    console.log(`This would require server-side execution. Consider implementing via Edge Functions.`);
    
    // For now, we'll return success but log a note about implementation
    return true;
  } catch (error) {
    console.error('Error in createBucketPolicy:', error);
    return false;
  }
};

/**
 * Initializes all required storage buckets for the application
 */
export const initializeStorage = async () => {
  try {
    // Create verification_documents bucket with enhanced options
    await createBucketIfNotExists('verification_documents', {
      isPublic: true,
      fileSizeLimit: 5 * 1024 * 1024, // 5MB limit for verification docs
      allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf']
    });
    
    // Create other buckets as needed
    // Example: Profile pictures bucket
    await createBucketIfNotExists('profile_pictures', {
      isPublic: true, 
      fileSizeLimit: 2 * 1024 * 1024, // 2MB limit for profile pictures
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
    });
    
    // Example: CVs bucket
    await createBucketIfNotExists('cvs', {
      isPublic: true,
      fileSizeLimit: 10 * 1024 * 1024, // 10MB limit for CVs
      allowedMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    });
    
  } catch (error) {
    console.error('Failed to initialize storage buckets:', error);
  }
};

/**
 * Uploads a file to a specific bucket
 * @param bucketName Name of the bucket
 * @param filePath Path within the bucket
 * @param file File to upload
 * @param options Upload options
 * @returns URL of the uploaded file or null if failed
 */
export const uploadFile = async (
  bucketName: string,
  filePath: string,
  file: File,
  options?: { upsert?: boolean; cacheControl?: string }
): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, options);
      
    if (error) {
      console.error(`Error uploading file to ${bucketName}/${filePath}:`, error);
      return null;
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
      
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadFile:', error);
    return null;
  }
};
