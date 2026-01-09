/**
 * Pollution Reports Service
 * 
 * Handles CRUD operations for pollution reports in Firestore.
 * Provides real-time subscription capabilities for dynamic map updates.
 */

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const COLLECTION_NAME = 'pollution_reports';

/**
 * Creates a new pollution report
 * @param {Object} reportData - Report data
 * @param {Object} reportData.location - Location object with latitude and longitude
 * @param {string} reportData.imageUrl - URL of the uploaded image
 * @param {Object} reportData.metadata - Additional metadata (accuracy, site, type, etc.)
 * @returns {Promise<{success: boolean, reportId?: string, error?: string}>}
 */
export const createReport = async (reportData) => {
  try {
    const { location, imageUrl, metadata = {} } = reportData;

    if (!location || !location.latitude || !location.longitude) {
      return {
        success: false,
        error: 'Location data is required'
      };
    }

    if (!imageUrl) {
      return {
        success: false,
        error: 'Image URL is required'
      };
    }

    const report = {
      status: 'detected', // Default status for new reports
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy || null,
        altitude: location.altitude || null
      },
      imageUrl,
      metadata: {
        site: metadata.site || null,
        type: metadata.type || null,
        ...metadata
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), report);

    console.log('Report created successfully:', docRef.id);
    return {
      success: true,
      reportId: docRef.id
    };
  } catch (error) {
    console.error('Error creating report:', error);
    return {
      success: false,
      error: error.message || 'Failed to create report'
    };
  }
};

/**
 * Fetches all pollution reports
 * @returns {Promise<{success: boolean, reports?: Array, error?: string}>}
 */
export const getAllReports = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const reports = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      success: true,
      reports
    };
  } catch (error) {
    console.error('Error fetching reports:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch reports'
    };
  }
};

/**
 * Subscribes to real-time updates of pollution reports
 * @param {Function} callback - Callback function that receives reports array
 * @returns {Function} Unsubscribe function
 */
export const subscribeToReports = (callback) => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const reports = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(reports);
      },
      (error) => {
        console.error('Error in reports subscription:', error);
        callback([]);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up subscription:', error);
    return () => { }; // Return no-op unsubscribe function
  }
};

/**
 * Updates the status of a pollution report
 * @param {string} reportId - Document ID of the report
 * @param {string} newStatus - New status ('detected', 'in_progress', 'resolved')
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const updateReportStatus = async (reportId, newStatus) => {
  try {
    const validStatuses = ['detected', 'in_progress', 'resolved'];

    if (!validStatuses.includes(newStatus)) {
      return {
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      };
    }

    const reportRef = doc(db, COLLECTION_NAME, reportId);
    await updateDoc(reportRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });

    console.log('Report status updated successfully:', reportId, newStatus);
    return {
      success: true
    };
  } catch (error) {
    console.error('Error updating report status:', error);
    return {
      success: false,
      error: error.message || 'Failed to update report status'
    };
  }
};

/**
 * Deletes a pollution report
 * @param {string} reportId - Document ID of the report
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteReport = async (reportId) => {
  try {
    const reportRef = doc(db, COLLECTION_NAME, reportId);
    await deleteDoc(reportRef);

    console.log('Report deleted successfully:', reportId);
    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting report:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete report'
    };
  }
};
