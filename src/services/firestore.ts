import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  limit,
  Timestamp 
} from "firebase/firestore";
import { db } from "@/utils/fireBaseAuthProvider";

// Types
export interface Class {
  id?: string;
  title: string;
  instructor: string;
  date: Date;
  duration: number;
  capacity: number;
  enrolled: number;
  description?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface User {
  id?: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  membershipType?: string;
  joinedDate: Date;
}

// Class CRUD Operations
export const classService = {
  // Create
  async addClass(classData: Omit<Class, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, "classes"), {
        ...classData,
        date: Timestamp.fromDate(classData.date),
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding class:", error);
      throw error;
    }
  },

  // Read single
  async getClass(classId: string) {
    try {
      const docSnap = await getDoc(doc(db, "classes", classId));
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          date: data.date.toDate()
        } as Class;
      }
      return null;
    } catch (error) {
      console.error("Error getting class:", error);
      throw error;
    }
  },

  // Read all with filters
  async getClasses(filters?: { 
    instructor?: string; 
    level?: string;
    upcoming?: boolean;
  }) {
    try {
      let q = query(collection(db, "classes"));
      
      if (filters?.instructor) {
        q = query(q, where("instructor", "==", filters.instructor));
      }
      
      if (filters?.level) {
        q = query(q, where("level", "==", filters.level));
      }
      
      if (filters?.upcoming) {
        q = query(q, 
          where("date", ">=", Timestamp.now()),
          orderBy("date", "asc")
        );
      } else {
        q = query(q, orderBy("date", "desc"));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate()
      })) as Class[];
    } catch (error) {
      console.error("Error getting classes:", error);
      throw error;
    }
  },

  // Update
  async updateClass(classId: string, updates: Partial<Class>) {
    try {
      const updateData: any = { ...updates };
      if (updates.date) {
        updateData.date = Timestamp.fromDate(updates.date);
      }
      updateData.updatedAt = Timestamp.now();
      
      await updateDoc(doc(db, "classes", classId), updateData);
      return true;
    } catch (error) {
      console.error("Error updating class:", error);
      throw error;
    }
  },

  // Delete
  async deleteClass(classId: string) {
    try {
      await deleteDoc(doc(db, "classes", classId));
      return true;
    } catch (error) {
      console.error("Error deleting class:", error);
      throw error;
    }
  },

  // Enroll user in class
  async enrollInClass(classId: string, userId: string) {
    try {
      const classDoc = doc(db, "classes", classId);
      const classData = await getDoc(classDoc);
      
      if (!classData.exists()) {
        throw new Error("Class not found");
      }
      
      const current = classData.data();
      if (current.enrolled >= current.capacity) {
        throw new Error("Class is full");
      }
      
      // Add enrollment record
      await addDoc(collection(db, "enrollments"), {
        classId,
        userId,
        enrolledAt: Timestamp.now()
      });
      
      // Update class enrollment count
      await updateDoc(classDoc, {
        enrolled: current.enrolled + 1
      });
      
      return true;
    } catch (error) {
      console.error("Error enrolling in class:", error);
      throw error;
    }
  }
};

// User CRUD Operations
export const userService = {
  async createUser(userData: Omit<User, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        ...userData,
        joinedDate: Timestamp.fromDate(userData.joinedDate),
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  async getUser(userId: string) {
    try {
      const docSnap = await getDoc(doc(db, "users", userId));
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          joinedDate: data.joinedDate.toDate()
        } as User;
      }
      return null;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  },

  async updateUser(userId: string, updates: Partial<User>) {
    try {
      await updateDoc(doc(db, "users", userId), {
        ...updates,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
};