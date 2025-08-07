import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { authService } from '@/services/auth';
import { classService, Class } from '@/services/firestore';

// Auth hook
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
}

// Classes hook
export function useClasses(filters?: { instructor?: string; level?: string; upcoming?: boolean }) {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const data = await classService.getClasses(filters);
        setClasses(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch classes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [filters?.instructor, filters?.level, filters?.upcoming]);

  const addClass = async (classData: Omit<Class, 'id'>) => {
    try {
      const id = await classService.addClass(classData);
      const newClass = await classService.getClass(id);
      if (newClass) {
        setClasses([...classes, newClass]);
      }
      return id;
    } catch (err) {
      setError('Failed to add class');
      throw err;
    }
  };

  const updateClass = async (id: string, updates: Partial<Class>) => {
    try {
      await classService.updateClass(id, updates);
      setClasses(classes.map(c => c.id === id ? { ...c, ...updates } : c));
    } catch (err) {
      setError('Failed to update class');
      throw err;
    }
  };

  const deleteClass = async (id: string) => {
    try {
      await classService.deleteClass(id);
      setClasses(classes.filter(c => c.id !== id));
    } catch (err) {
      setError('Failed to delete class');
      throw err;
    }
  };

  return {
    classes,
    loading,
    error,
    addClass,
    updateClass,
    deleteClass
  };
}