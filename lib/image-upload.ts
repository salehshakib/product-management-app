export interface ImageUploadResponse {
  success: boolean;
  url?: string;
  public_id?: string;
  filename?: string;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
  error?: string;
}

export interface ImageDeleteResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Upload an image file to Cloudinary and return the URL for database storage
 * @param file - The image file to upload
 * @returns Promise with upload response containing URL and metadata
 */
export const uploadImage = async (file: File): Promise<ImageUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
    });

    const result: ImageUploadResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Upload failed');
    }

    return result;
  } catch (error) {
    console.error('Image upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
};

/**
 * Delete an image from Cloudinary using its public_id
 * @param publicId - The public_id of the image to delete
 * @returns Promise with deletion response
 */
export const deleteImage = async (publicId: string): Promise<ImageDeleteResponse> => {
  try {
    const response = await fetch(`/api/upload/image?public_id=${encodeURIComponent(publicId)}`, {
      method: 'DELETE',
    });

    const result: ImageDeleteResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Delete failed');
    }

    return result;
  } catch (error) {
    console.error('Image delete error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    };
  }
};

/**
 * Extract public_id from Cloudinary URL for deletion purposes
 * @param url - Cloudinary URL
 * @returns public_id string or null if not found
 */
export const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    // Cloudinary URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.ext
    const match = url.match(/\/v\d+\/(.+)\.[a-zA-Z]+$/);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting public_id:', error);
    return null;
  }
};

/**
 * Validate and return avatar URL
 * @param avatar - The avatar URL from database
 * @returns Valid avatar URL or null if invalid
 */
export const buildCloudinaryUrl = (avatar: string | null | undefined): string | null => {
  // More robust validation
  if (!avatar || typeof avatar !== 'string' || avatar.trim() === '') {
    return null;
  }

  const cleanAvatar = avatar.trim();

  // Since we now store full URLs in the database, just validate and return them
  if (cleanAvatar.startsWith('http')) {
    try {
      // Validate the URL by creating a URL object
      new URL(cleanAvatar);
      return cleanAvatar;
    } catch (error) {
      console.error('Invalid URL provided to buildCloudinaryUrl:', cleanAvatar, error);
      return null;
    }
  }

  // For backwards compatibility, if it's still a filename, try to build URL
  try {
    // It's a filename, build the Cloudinary URL
    // Remove extension from filename to get public_id
    const publicId = cleanAvatar.replace(/\.[^/.]+$/, '');

    // Validate that we have a meaningful public_id
    if (!publicId || publicId.trim() === '') {
      console.warn('Empty public_id after processing filename:', cleanAvatar);
      return null;
    }

    // For now, we'll use a generic cloudinary URL structure
    // You may need to update this with your actual cloud name
    const cloudinaryUrl = `https://res.cloudinary.com/dxxlmgkhi/image/upload/perfume-ecommerce/${publicId}`;

    // Validate the constructed URL
    try {
      new URL(cloudinaryUrl);
      return cloudinaryUrl;
    } catch (urlError) {
      console.error('Failed to construct valid Cloudinary URL:', cloudinaryUrl, urlError);
      return null;
    }
  } catch (error) {
    console.error('Error processing avatar value:', error);
    return null;
  }
};

/**
 * Validate if file is an image and within size limits
 * @param file - File to validate
 * @param maxSizeMB - Maximum file size in MB (default: 10)
 * @returns Object with isValid boolean and error message if invalid
 */
export const validateImageFile = (
  file: File,
  maxSizeMB: number = 10
): { isValid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'File must be an image' };
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { isValid: false, error: `File size must be less than ${maxSizeMB}MB` };
  }

  // Check supported formats
  const supportedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!supportedTypes.includes(file.type)) {
    return { isValid: false, error: 'Supported formats: JPEG, PNG, GIF, WebP' };
  }

  return { isValid: true };
};