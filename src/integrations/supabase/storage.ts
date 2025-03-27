
import { supabase } from './client';

export const createBucketIfNotExists = async (bucketName: string, isPublic: boolean = false) => {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      // Create bucket if it doesn't exist
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: isPublic,
      });
      
      if (error) {
        console.error('Error creating bucket:', error);
        throw error;
      }
      
      console.log(`Bucket ${bucketName} created successfully.`);
    } else {
      console.log(`Bucket ${bucketName} already exists.`);
    }
    
    return true;
  } catch (error) {
    console.error('Error in createBucketIfNotExists:', error);
    return false;
  }
};

// Call this function to ensure the verification_documents bucket exists
export const initializeStorage = async () => {
  try {
    await createBucketIfNotExists('verification_documents', true);
  } catch (error) {
    console.error('Failed to initialize storage buckets:', error);
  }
};
