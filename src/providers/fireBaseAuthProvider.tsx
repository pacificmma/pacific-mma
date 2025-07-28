// src/providers/fireBaseAuthProvider.tsx - UPDATED FOR MEMBERS COLLECTION
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
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, db } from '../utils/fireBaseAuthProvider';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// 🏗️ Member Interface - Firestore document yapısına uygun
interface MemberProfile {
  uid: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: 'member';
  isActive: boolean;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  awards?: string[];
  classRegistrations?: string[];
  parentId?: string | null;
  createdAt?: any;
  updatedAt?: any;
  createdBy?: string;
  updatedBy?: string;
}

// 🔐 Sign Up Data Interface
interface SignUpData {
  fullName: string;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

// 🎯 Auth Context Type
interface AuthContextType {
  user: MemberProfile | null;
  loading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: SignUpData) => Promise<void>;
  logout: () => Promise<void>;
  
  isLoginModalOpen: boolean;
  isSignUpModalOpen: boolean;
  showLoginModal: () => void;
  showSignUpModal: () => void;
  closeModals: () => void;
  
  setUser: React.Dispatch<React.SetStateAction<MemberProfile | null>>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const FirebaseAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false);

  const showLoginModal = () => {
    clearError();
    setLoginModalOpen(true);
  };
  
  const showSignUpModal = () => {
    clearError();
    setSignUpModalOpen(true);
  };
  
  const closeModals = () => {
    setLoginModalOpen(false);
    setSignUpModalOpen(false);
    clearError();
  };

  const clearError = () => setError(null);

  // 🔍 Firebase Auth State Change Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setLoading(true);
      
      if (firebaseUser) {
        try {
          // members collection'dan kullanıcı bilgilerini al
          const memberRef = doc(db, 'members', firebaseUser.uid);
          const memberSnap = await getDoc(memberRef);
          
          if (memberSnap.exists()) {
            const memberData = memberSnap.data() as MemberProfile;
            
            // 🔒 Güvenlik Kontrolü: Sadece aktif member'lar giriş yapabilir
            if (memberData.role === 'member' && memberData.isActive === true) {
              setUser(memberData);
            } else {
              // Yetkisiz kullanıcı - çıkış yap
              await signOut(auth);
              setUser(null);
              setError('Bu hesap aktif değil veya yetkisiz. Lütfen yönetici ile iletişime geçin.');
            }
          } else {
            // Firestore'da kayıt yok - çıkış yap
            await signOut(auth);
            setUser(null);
            setError('Kullanıcı kaydı bulunamadı.');
          }
        } catch (err) {
          console.error('User data fetch error:', err);
          setUser(null);
          setError('Kullanıcı bilgileri alınırken bir hata oluştu.');
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔐 Login Function
  const login = async (email: string, password: string) => {
    if (!email || !password) {
      setError('Email ve şifre gereklidir.');
      return;
    }

    setError(null);
    setLoading(true);
    
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Kullanıcı bilgilerini kontrol et
      const memberRef = doc(db, 'members', result.user.uid);
      const memberSnap = await getDoc(memberRef);
      
      if (!memberSnap.exists()) {
        await signOut(auth);
        throw new Error('Kullanıcı kaydı bulunamadı.');
      }
      
      const memberData = memberSnap.data() as MemberProfile;
      
      // Role ve aktiflik kontrolü
      if (memberData.role !== 'member') {
        await signOut(auth);
        throw new Error('Bu hesap müşteri paneline erişim yetkisine sahip değil.');
      }
      
      if (!memberData.isActive) {
        await signOut(auth);
        throw new Error('Hesabınız aktif değil. Lütfen yönetici ile iletişime geçin.');
      }
      
      // Başarılı giriş
      setUser(memberData);
      closeModals();
      
    } catch (err: unknown) {
      let errorMessage = 'Giriş sırasında bir hata oluştu.';
      
      if (err instanceof Error) {
        switch (err.message) {
          case 'Firebase: Error (auth/user-not-found).':
            errorMessage = 'Bu email adresi ile kayıtlı kullanıcı bulunamadı.';
            break;
          case 'Firebase: Error (auth/wrong-password).':
            errorMessage = 'Yanlış şifre girdiniz.';
            break;
          case 'Firebase: Error (auth/invalid-email).':
            errorMessage = 'Geçersiz email adresi.';
            break;
          case 'Firebase: Error (auth/too-many-requests).':
            errorMessage = 'Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin.';
            break;
          default:
            errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 📝 Register Function
  const register = async (email: string, password: string, userData: SignUpData) => {
    if (!email || !password || !userData.fullName || !userData.phoneNumber) {
      setError('Tüm gerekli alanları doldurun.');
      return;
    }

    setError(null);
    setLoading(true);
    
    try {
      // Firebase Authentication ile kullanıcı oluştur
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Firestore'a member kaydı oluştur
      const newMember: MemberProfile = {
        uid: result.user.uid,
        email: email.toLowerCase(),
        fullName: userData.fullName.trim(),
        phoneNumber: userData.phoneNumber.trim(),
        role: 'member',
        isActive: true,
        address: {
          street: userData.address.street.trim(),
          city: userData.address.city.trim(),
          state: userData.address.state.trim(),
          country: userData.address.country.trim(),
          zipCode: userData.address.zipCode.trim(),
        },
        emergencyContact: userData.emergencyContact ? {
          name: userData.emergencyContact.name.trim(),
          phone: userData.emergencyContact.phone.trim(),
          relationship: userData.emergencyContact.relationship.trim(),
        } : undefined,
        awards: [],
        classRegistrations: [],
        parentId: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: result.user.uid,
        updatedBy: result.user.uid,
      };
      
      // Firestore'a kaydet
      await setDoc(doc(db, 'members', newMember.uid), newMember);
      
      // State'i güncelle
      setUser(newMember);
      closeModals();
      
    } catch (err: unknown) {
      let errorMessage = 'Kayıt sırasında bir hata oluştu.';
      
      if (err instanceof Error) {
        switch (err.message) {
          case 'Firebase: Error (auth/email-already-in-use).':
            errorMessage = 'Bu email adresi zaten kullanımda.';
            break;
          case 'Firebase: Error (auth/weak-password).':
            errorMessage = 'Şifre çok zayıf. En az 6 karakter olmalıdır.';
            break;
          case 'Firebase: Error (auth/invalid-email).':
            errorMessage = 'Geçersiz email adresi.';
            break;
          default:
            errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 🚪 Logout Function
  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
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
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useFirebaseAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useFirebaseAuth must be used within FirebaseAuthProvider');
  }
  return context;
};