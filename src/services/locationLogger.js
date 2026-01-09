/**
 * Location Logger Service
 * 
 * Handles logging the location of images captured from the AI lens.
 * This module is isolated from the main application logic to ensure
 * it remains stable even if the backend changes.
 */

/**
 * Gets the current geolocation
 * @param {Object} options - Geolocation options
 * @param {number} options.timeout - Timeout in milliseconds (default: 10000)
 * @param {number} options.maximumAge - Maximum age of cached position in milliseconds (default: 60000)
 * @param {boolean} options.enableHighAccuracy - Enable high accuracy (default: true)
 * @returns {Promise<{success: boolean, location?: Object, error?: string}>}
 */
export const getCurrentLocation = async (options = {}) => {
  const {
    timeout = 10000,
    maximumAge = 60000,
    enableHighAccuracy = true
  } = options;

  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        success: false,
        error: 'Geolocation is not supported by this browser.'
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp
        };

        console.log("Location captured:", location);
        resolve({
          success: true,
          location
        });
      },
      (error) => {
        let errorMessage = 'Failed to get location.';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied by user.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
          default:
            errorMessage = 'An unknown error occurred while getting location.';
            break;
        }

        console.error("Location Error:", errorMessage, error);
        resolve({
          success: false,
          error: errorMessage
        });
      },
      {
        timeout,
        maximumAge,
        enableHighAccuracy
      }
    );
  });
};

/**
 * Logs the location of an image capture
 * @param {Object} imageData - Image metadata
 * @param {string} imageData.imageUrl - URL of the uploaded image (optional)
 * @param {string} imageData.imageDataUrl - Data URL of the image (optional)
 * @param {Object} location - Location data from getCurrentLocation
 * @returns {Promise<{success: boolean, logId?: string, error?: string}>}
 */
export const logImageLocation = async (imageData, location) => {
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      imageUrl: imageData.imageUrl || null,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        altitude: location.altitude || null,
        heading: location.heading || null,
        speed: location.speed || null
      }
    };

    // For now, we'll log to console and localStorage
    // In the future, this can be extended to send to a backend API
    console.log("Image Location Log:", logEntry);

    // Store in localStorage for persistence
    const logs = JSON.parse(localStorage.getItem('imageLocationLogs') || '[]');
    const logId = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    logs.push({ id: logId, ...logEntry });
    localStorage.setItem('imageLocationLogs', JSON.stringify(logs));

    return {
      success: true,
      logId,
      logEntry
    };
  } catch (err) {
    console.error("Location Logging Error:", err);
    return {
      success: false,
      error: err.message || "Failed to log location"
    };
  }
};

/**
 * Gets all logged image locations
 * @returns {Array} Array of log entries
 */
export const getImageLocationLogs = () => {
  try {
    const logs = JSON.parse(localStorage.getItem('imageLocationLogs') || '[]');
    return logs;
  } catch (err) {
    console.error("Error retrieving location logs:", err);
    return [];
  }
};

/**
 * Clears all location logs
 * @returns {boolean}
 */
export const clearLocationLogs = () => {
  try {
    localStorage.removeItem('imageLocationLogs');
    return true;
  } catch (err) {
    console.error("Error clearing location logs:", err);
    return false;
  }
};
