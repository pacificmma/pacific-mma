import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth, db } from '../utils/fireBaseAuthProvider';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface UserProfile {
  uid: string;
  email: string;
  phone?: string;
  displayName?: string;
  fullName?: string;
  birthDate?: string;
  gender?: string;
  photoURL?: string;
  address?: {
    street?: string;
    city?: string;
    county?: string;
    state?: string;
    zipCode?: string;
  };
  [key: string]: unknown;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    extraData?: Partial<UserProfile>
  ) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;

  isLoginModalOpen: boolean;
  isSignUpModalOpen: boolean;
  showLoginModal: () => void;
  showSignUpModal: () => void;
  closeModals: () => void;

  // 🔄 Global state güncelleme
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const FirebaseAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false);

  const showLoginModal = () => setLoginModalOpen(true);
  const showSignUpModal = () => setSignUpModalOpen(true);
  const closeModals = () => {
    setLoginModalOpen(false);
    setSignUpModalOpen(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser(userSnap.data() as UserProfile);
        } else {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email ?? '',
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date(),
        });
      }

      setUser({
        uid: user.uid,
        email: user.email ?? '',
        displayName: user.displayName ?? '',
        photoURL: user.photoURL ?? '',
      });

      closeModals();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during Google sign-in');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    extraData?: Partial<UserProfile>
  ) => {
    setError(null);
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const newUser: UserProfile = {
        uid: res.user.uid,
        email,
        ...extraData,
      };
      await setDoc(doc(db, 'users', newUser.uid), newUser);
      setUser(newUser);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser, // <- önemli
        loading,
        error,
        login,
        register,
        logout,
        isLoginModalOpen,
        isSignUpModalOpen,
        showLoginModal,
        showSignUpModal,
        closeModals,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useFirebaseAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error('useFirebaseAuth must be used within FirebaseAuthProvider');
  return context;
};