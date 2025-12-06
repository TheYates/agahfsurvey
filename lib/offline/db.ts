/**
 * IndexedDB utilities for offline survey storage
 */

const DB_NAME = 'agahf-survey-offline';
const DB_VERSION = 1;
const STORE_NAME = 'pending-submissions';

export interface OfflineSubmission {
  id: string;
  timestamp: number;
  surveyData: any;
  synced: boolean;
  syncAttempts: number;
  lastSyncAttempt?: number;
  error?: string;
}

/**
 * Open IndexedDB connection
 */
export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        objectStore.createIndex('timestamp', 'timestamp', { unique: false });
        objectStore.createIndex('synced', 'synced', { unique: false });
      }
    };
  });
};

/**
 * Save submission to offline storage
 */
export const saveOfflineSubmission = async (
  surveyData: any
): Promise<string> => {
  const db = await openDB();
  const id = `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const submission: OfflineSubmission = {
    id,
    timestamp: Date.now(),
    surveyData,
    synced: false,
    syncAttempts: 0,
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(submission);

    request.onsuccess = () => {
      resolve(id);
    };

    request.onerror = () => {
      reject(new Error('Failed to save offline submission'));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

/**
 * Get all pending submissions
 */
export const getPendingSubmissions = async (): Promise<OfflineSubmission[]> => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('synced');
    const request = index.getAll(false);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(new Error('Failed to get pending submissions'));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

/**
 * Get all submissions (synced and pending)
 */
export const getAllSubmissions = async (): Promise<OfflineSubmission[]> => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(new Error('Failed to get all submissions'));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

/**
 * Mark submission as synced
 */
export const markAsSynced = async (id: string): Promise<void> => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const submission = getRequest.result;
      if (submission) {
        submission.synced = true;
        const updateRequest = store.put(submission);

        updateRequest.onsuccess = () => {
          resolve();
        };

        updateRequest.onerror = () => {
          reject(new Error('Failed to mark as synced'));
        };
      } else {
        reject(new Error('Submission not found'));
      }
    };

    getRequest.onerror = () => {
      reject(new Error('Failed to get submission'));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

/**
 * Update sync attempt
 */
export const updateSyncAttempt = async (
  id: string,
  error?: string
): Promise<void> => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const submission = getRequest.result;
      if (submission) {
        submission.syncAttempts += 1;
        submission.lastSyncAttempt = Date.now();
        if (error) {
          submission.error = error;
        }

        const updateRequest = store.put(submission);

        updateRequest.onsuccess = () => {
          resolve();
        };

        updateRequest.onerror = () => {
          reject(new Error('Failed to update sync attempt'));
        };
      } else {
        reject(new Error('Submission not found'));
      }
    };

    getRequest.onerror = () => {
      reject(new Error('Failed to get submission'));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

/**
 * Delete synced submissions older than specified days
 */
export const cleanupOldSubmissions = async (daysOld: number = 7): Promise<number> => {
  const db = await openDB();
  const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const submissions: OfflineSubmission[] = request.result;
      let deletedCount = 0;

      submissions.forEach((submission) => {
        if (submission.synced && submission.timestamp < cutoffTime) {
          store.delete(submission.id);
          deletedCount++;
        }
      });

      resolve(deletedCount);
    };

    request.onerror = () => {
      reject(new Error('Failed to cleanup old submissions'));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

/**
 * Delete a specific submission
 */
export const deleteSubmission = async (id: string): Promise<void> => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error('Failed to delete submission'));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

/**
 * Clear all submissions
 */
export const clearAllSubmissions = async (): Promise<void> => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error('Failed to clear submissions'));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};
