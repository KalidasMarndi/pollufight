/**
 * Cloudinary Upload Service
 * 
 * Handles uploading images to Cloudinary.
 * This module is isolated from the main application logic to ensure
 * it remains stable even if the backend changes.
 */

/**
 * Uploads an image to Cloudinary
 * @param {string} imageDataUrl - The image as a data URL (base64)
 * @param {Object} options - Optional configuration
 * @param {Function} options.onProgress - Optional progress callback
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export const uploadToCloudinary = async (imageDataUrl, options = {}) => {
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  if (!CLOUDINARY_UPLOAD_PRESET || !CLOUDINARY_CLOUD_NAME) {
    return {
      success: false,
      error: 'Cloudinary configuration is missing. Please check your environment variables.'
    };
  }

  try {
    // Convert data URL to Blob for Cloudinary upload
    const blobResponse = await fetch(imageDataUrl);
    const blob = await blobResponse.blob();

    const formData = new FormData();
    formData.append('file', blob, 'image.jpg');
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );

    const data = await response.json();

    if (data.secure_url) {
      console.log("Cloudinary Upload Success:", data.secure_url);
      return {
        success: true,
        url: data.secure_url,
        publicId: data.public_id,
        data: data
      };
    } else {
      throw new Error(data.error?.message || "Upload failed");
    }
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    return {
      success: false,
      error: err.message || "Upload failed"
    };
  }
};

/**
 * Validates Cloudinary configuration
 * @returns {boolean}
 */
export const validateCloudinaryConfig = () => {
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  return !!(CLOUDINARY_UPLOAD_PRESET && CLOUDINARY_CLOUD_NAME);
};
