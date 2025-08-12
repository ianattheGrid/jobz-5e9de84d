-- Make candidate_gallery bucket public to fix image upload issues
UPDATE storage.buckets 
SET public = true 
WHERE id = 'candidate_gallery';