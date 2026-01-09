/**
 * User Credits Service
 * 
 * Handles CRUD operations for user credits in Firestore.
 * Provides functions to get, increment, and decrement user credits.
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const COLLECTION_NAME = 'user_credits';

/**
 * Gets or creates a user ID from localStorage
 * @returns {string} User ID
 */
export const getUserId = () => {
  let userId = localStorage.getItem('pollufight_user_id');
  if (!userId) {
    // Generate a simple user ID
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('pollufight_user_id', userId);
  }
  return userId;
};

/**
 * Gets user credits from Firestore
 * @param {string} userId - Optional user ID, will use stored ID if not provided
 * @returns {Promise<{success: boolean, credits?: number, error?: string}>}
 */
export const getUserCredits = async (userId = null) => {
  try {
    const uid = userId || getUserId();
    const userRef = doc(db, COLLECTION_NAME, uid);

    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        success: true,
        credits: data.credits || 0
      };
    } else {
      // User doesn't exist, create with default credits
      await setDoc(userRef, {
        credits: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return {
        success: true,
        credits: 0
      };
    }
  } catch (error) {
    console.error('Error getting user credits:', error);
    return {
      success: false,
      error: error.message || 'Failed to get user credits'
    };
  }
};

/**
 * Increments user credits by a specified amount
 * @param {number} amount - Amount to increment (default: 1)
 * @param {string} userId - Optional user ID, will use stored ID if not provided
 * @returns {Promise<{success: boolean, credits?: number, error?: string}>}
 */
export const incrementCredits = async (amount = 1, userId = null) => {
  try {
    const uid = userId || getUserId();
    const userRef = doc(db, COLLECTION_NAME, uid);

    // Check if user document exists
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      // Update existing document using increment
      await updateDoc(userRef, {
        credits: increment(amount),
        updatedAt: serverTimestamp()
      });
    } else {
      // Create new document with initial credits
      await setDoc(userRef, {
        credits: amount,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    // Fetch updated credits
    const updatedDoc = await getDoc(userRef);
    const updatedCredits = updatedDoc.data()?.credits || amount;

    return {
      success: true,
      credits: updatedCredits
    };
  } catch (error) {
    console.error('Error incrementing credits:', error);
    return {
      success: false,
      error: error.message || 'Failed to increment credits'
    };
  }
};

/**
 * Decrements user credits by a specified amount
 * @param {number} amount - Amount to decrement (default: 1)
 * @param {string} userId - Optional user ID, will use stored ID if not provided
 * @returns {Promise<{success: boolean, credits?: number, error?: string}>}
 */
export const decrementCredits = async (amount = 1, userId = null) => {
  try {
    const uid = userId || getUserId();
    const userRef = doc(db, COLLECTION_NAME, uid);

    // Check if user document exists
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const currentCredits = docSnap.data()?.credits || 0;
      const newCredits = Math.max(0, currentCredits - amount); // Prevent negative credits

      await updateDoc(userRef, {
        credits: newCredits,
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        credits: newCredits
      };
    } else {
      // User doesn't exist, can't decrement
      return {
        success: false,
        error: 'User does not exist. Cannot decrement credits.'
      };
    }
  } catch (error) {
    console.error('Error decrementing credits:', error);
    return {
      success: false,
      error: error.message || 'Failed to decrement credits'
    };
  }
};

/**
 * Sets user credits to a specific amount
 * @param {number} amount - Amount to set
 * @param {string} userId - Optional user ID, will use stored ID if not provided
 * @returns {Promise<{success: boolean, credits?: number, error?: string}>}
 */
export const setUserCredits = async (amount, userId = null) => {
  try {
    const uid = userId || getUserId();
    const userRef = doc(db, COLLECTION_NAME, uid);

    await setDoc(userRef, {
      credits: Math.max(0, amount), // Prevent negative credits
      updatedAt: serverTimestamp()
    }, { merge: true });

    return {
      success: true,
      credits: amount
    };
  } catch (error) {
    console.error('Error setting credits:', error);
    return {
      success: false,
      error: error.message || 'Failed to set credits'
    };
  }
};
