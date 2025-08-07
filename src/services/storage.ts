import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll 
} from "firebase/storage";
import { initializeApp, getApps } from "firebase/app";

// Initialize storage
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const storage = getStorage(app);

export const storageService = {
  // Upload profile picture
  async uploadProfilePicture(userId: string, file: File) {
    try {
      const storageRef = ref(storage, `profile-pictures/${userId}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      throw error;
    }
  },

  // Upload class image
  async uploadClassImage(classId: string, file: File) {
    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      const storageRef = ref(storage, `class-images/${classId}/${fileName}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading class image:", error);
      throw error;
    }
  },

  // Upload multiple files
  async uploadMultipleFiles(path: string, files: File[]) {
    try {
      const uploadPromises = files.map(async (file) => {
        const storageRef = ref(storage, `${path}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return {
          name: file.name,
          url: downloadURL,
          size: file.size,
          type: file.type
        };
      });
      
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Error uploading multiple files:", error);
      throw error;
    }
  },

  // Delete file
  async deleteFile(filePath: string) {
    try {
      const storageRef = ref(storage, filePath);
      await deleteObject(storageRef);
      return true;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  },

  // List all files in a directory
  async listFiles(path: string) {
    try {
      const listRef = ref(storage, path);
      const result = await listAll(listRef);
      
      const files = await Promise.all(
        result.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return {
            name: itemRef.name,
            fullPath: itemRef.fullPath,
            url
          };
        })
      );
      
      return files;
    } catch (error) {
      console.error("Error listing files:", error);
      throw error;
    }
  },

  // Get download URL for existing file
  async getFileURL(filePath: string) {
    try {
      const storageRef = ref(storage, filePath);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error getting file URL:", error);
      throw error;
    }
  }
};