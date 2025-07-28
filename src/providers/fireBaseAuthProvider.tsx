// src/providers/fireBaseAuthProvider.tsx - REGISTRATION FLAG İLE DÜZELTİLMİŞ
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc, getFirestore } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ DEBUGGING: Console'a export'ları yazdır
console.log('🔥 Firebase initialized:', {
  auth: !!auth,
  db: !!db,
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain
});

// ✅ Global olarak da erişilebilir yap (development için)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).firebaseAuth = auth;
  (window as any).firebaseDb = db;
  console.log('🌐 Firebase globals available: window.firebaseAuth, window.firebaseDb');
}

// Default export (backward compatibility için)
export default { auth, db };

// 🛡️ Security utilities import
import { 
  SecurityValidator, 
  AuthSecurity, 
  SimpleAuditLogger 
} from '../utils/security';

// 🏗️ Member Interface - Firestore document structure
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

  // 🆕 Registration flag to prevent auth state listener interference
  const isRegistering = useRef<boolean>(false);

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

  // 🔍 Firebase Auth State Change Listener - REGISTRATION AWARE
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      // 🆕 Skip auth state processing during registration
      if (isRegistering.current) {
        console.log('🔄 Auth state change detected during registration - skipping listener');
        return;
      }

      setLoading(true);
      
      if (firebaseUser) {
        try {
          // Small delay to allow for potential ongoing registration
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Double-check registration flag after delay
          if (isRegistering.current) {
            console.log('🔄 Registration still in progress - skipping auth state processing');
            setLoading(false);
            return;
          }

          // Get user information from members collection
          const memberRef = doc(db, 'members', firebaseUser.uid);
          const memberSnap = await getDoc(memberRef);
          
          if (memberSnap.exists()) {
            const memberData = memberSnap.data() as MemberProfile;
            
            // 🔒 Security Check: Only active members can log in
            if (memberData.role === 'member' && memberData.isActive === true) {
              setUser(memberData);
              
              // 🆕 Log successful authentication
              SimpleAuditLogger.logSecurityEvent(
                'LOGIN', 
                firebaseUser.uid, 
                { method: 'state_change', email: memberData.email },
                'LOW'
              );
            } else {
              // Unauthorized user - sign out
              await signOut(auth);
              setUser(null);
              setError('This account is inactive or unauthorized. Please contact administrator.');
              
              // 🆕 Log unauthorized access attempt
              SimpleAuditLogger.logSecurityEvent(
                'SUSPICIOUS_ACTIVITY', 
                firebaseUser.uid, 
                { reason: 'Inactive or unauthorized account', role: memberData.role, isActive: memberData.isActive },
                'HIGH'
              );
            }
          } else {
            // No Firestore record - only sign out if not registering
            if (!isRegistering.current) {
              console.log('🔍 No Firestore record found and not registering - signing out user');
              await signOut(auth);
              setUser(null);
              setError('User record not found.');
              
              // 🆕 Log missing user record
              SimpleAuditLogger.logSecurityEvent(
                'SUSPICIOUS_ACTIVITY', 
                firebaseUser.uid, 
                { reason: 'User not found in Firestore' },
                'HIGH'
              );
            } else {
              console.log('🔍 No Firestore record but registration in progress - allowing');
            }
          }
        } catch (err) {
          console.error('User data fetch error:', err);
          if (!isRegistering.current) {
            setUser(null);
            setError('An error occurred while fetching user information.');
          }
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔐 Enhanced Login Function
  const login = async (email: string, password: string) => {
    // 🆕 Input validation
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    // 🆕 Input sanitization
    const sanitizedEmail = SecurityValidator.sanitizeInput(email.toLowerCase()).trim();
    
    if (!SecurityValidator.validateEmail(sanitizedEmail)) {
      setError('Invalid email format.');
      return;
    }

    // 🆕 Rate limiting check
    if (!AuthSecurity.trackLoginAttempt(sanitizedEmail)) {
      setError('Too many failed login attempts. Please try again in 15 minutes.');
      SimpleAuditLogger.logSecurityEvent(
        'SUSPICIOUS_ACTIVITY', 
        sanitizedEmail, 
        { reason: 'Rate limit exceeded' },
        'HIGH'
      );
      return;
    }

    setError(null);
    setLoading(true);
    
    try {
      // 🔄 Use sanitized email
      const result = await signInWithEmailAndPassword(auth, sanitizedEmail, password);
      
      // Check user information
      const memberRef = doc(db, 'members', result.user.uid);
      const memberSnap = await getDoc(memberRef);
      
      if (!memberSnap.exists()) {
        await signOut(auth);
        throw new Error('User record not found.');
      }
      
      const memberData = memberSnap.data() as MemberProfile;
      
      // Role and activity check
      if (memberData.role !== 'member') {
        await signOut(auth);
        throw new Error('This account does not have access to the member portal.');
      }
      
      if (!memberData.isActive) {
        await signOut(auth);
        throw new Error('Your account is inactive. Please contact administrator.');
      }
      
      // Successful login
      setUser(memberData);
      closeModals();

      // 🆕 Log successful login
      SimpleAuditLogger.logSecurityEvent(
        'LOGIN', 
        result.user.uid, 
        { method: 'email_password', success: true },
        'LOW'
      );
      
    } catch (err: unknown) {
      let errorMessage = 'An error occurred during login.';
      
      if (err instanceof Error) {
        const errorCode = (err as any).code;
        switch (errorCode || err.message) {
          case 'auth/user-not-found':
          case 'Firebase: Error (auth/user-not-found).':
            errorMessage = 'No user found with this email address.';
            break;
          case 'auth/wrong-password':
          case 'Firebase: Error (auth/wrong-password).':
            errorMessage = 'Incorrect password.';
            break;
          case 'auth/invalid-email':
          case 'Firebase: Error (auth/invalid-email).':
            errorMessage = 'Invalid email address.';
            break;
          case 'auth/too-many-requests':
          case 'Firebase: Error (auth/too-many-requests).':
            errorMessage = 'Too many failed login attempts. Please try again later.';
            break;
          default:
            errorMessage = err.message;
        }

        // 🆕 Log failed login
        SimpleAuditLogger.logSecurityEvent(
          'LOGIN', 
          sanitizedEmail, 
          { method: 'email_password', success: false, error: err.message, code: errorCode },
          'MEDIUM'
        );
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 📝 Enhanced Register Function - WITH REGISTRATION FLAG
  const register = async (email: string, password: string, userData: SignUpData) => {
    console.log('🚀 REGISTRATION DEBUG BAŞLADI');
    console.log('=================================');
    
    // 🆕 Set registration flag to prevent auth listener interference
    isRegistering.current = true;
    console.log('🔒 Registration flag set - auth listener paused');
    
    try {
      // Input validation
      if (!email || !password || !userData.fullName || !userData.phoneNumber) {
        console.error('❌ INPUT VALIDATION FAILED: Missing required fields');
        setError('Please fill in all required fields.');
        return;
      }

      console.log('✅ Input validation PASSED');

      const sanitizedEmail = SecurityValidator.sanitizeInput(email.toLowerCase()).trim();
      const sanitizedUserData = SecurityValidator.sanitizeForDatabase(userData) as SignUpData;

      console.log('📧 Email:', sanitizedEmail);
      console.log('👤 User data structure:', {
        hasFullName: !!sanitizedUserData.fullName,
        hasPhone: !!sanitizedUserData.phoneNumber,
        hasAddress: !!sanitizedUserData.address,
        addressComplete: !!(sanitizedUserData.address?.street && sanitizedUserData.address?.city)
      });

      // Validation checks
      if (!SecurityValidator.validateEmail(sanitizedEmail)) {
        console.error('❌ EMAIL VALIDATION FAILED');
        setError('Invalid email format.');
        return;
      }

      if (!SecurityValidator.validatePhone(sanitizedUserData.phoneNumber)) {
        console.error('❌ PHONE VALIDATION FAILED');
        setError('Invalid phone number format.');
        return;
      }

      if (!SecurityValidator.validateString(sanitizedUserData.fullName, 2, 50)) {
        console.error('❌ NAME VALIDATION FAILED');
        setError('Name must be between 2 and 50 characters.');
        return;
      }

      const passwordValidation = AuthSecurity.validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        console.error('❌ PASSWORD VALIDATION FAILED');
        setError(`Password requirements: ${passwordValidation.errors.join(', ')}`);
        return;
      }

      console.log('✅ All validations PASSED');

      setError(null);
      setLoading(true);
      
      let authUser: any = null;
      
      try {
        // 🔥 STEP 1: Firebase Auth user creation
        console.log('🔄 STEP 1: Creating Firebase Auth user...');
        
        console.log('Auth config check:', {
          hasAuth: !!auth,
          appName: auth?.app?.name,
          projectId: auth?.app?.options?.projectId,
          authDomain: auth?.app?.options?.authDomain
        });
        
        const result = await createUserWithEmailAndPassword(auth, sanitizedEmail, password);
        authUser = result.user;
        
        console.log('✅ STEP 1 SUCCESS: Firebase Auth user created');
        console.log('🆔 User ID:', authUser.uid);
        console.log('📧 User Email:', authUser.email);
        console.log('🕐 Creation Time:', authUser.metadata.creationTime);

        // 🔥 STEP 2: Prepare Firestore data (simplified, no waiting needed)
        console.log('🔄 STEP 2: Preparing Firestore data...');
        
        const baseData = {
          uid: authUser.uid,
          email: sanitizedEmail,
          fullName: sanitizedUserData.fullName.trim(),
          phoneNumber: sanitizedUserData.phoneNumber.trim(),
          role: 'member' as const,
          isActive: true,
          address: {
            street: sanitizedUserData.address.street?.trim() || '',
            city: sanitizedUserData.address.city?.trim() || '',
            state: sanitizedUserData.address.state?.trim() || '',
            country: sanitizedUserData.address.country?.trim() || 'USA',
            zipCode: sanitizedUserData.address.zipCode?.trim() || '',
          },
          awards: [],
          classRegistrations: [],
          parentId: null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdBy: authUser.uid,
          updatedBy: authUser.uid,
        };

        // Add emergency contact if provided
        const newMember: MemberProfile = sanitizedUserData.emergencyContact && 
          sanitizedUserData.emergencyContact.name && 
          sanitizedUserData.emergencyContact.phone 
          ? {
              ...baseData,
              emergencyContact: {
                name: sanitizedUserData.emergencyContact.name.trim(),
                phone: sanitizedUserData.emergencyContact.phone.trim(),
                relationship: sanitizedUserData.emergencyContact.relationship?.trim() || 'Not specified',
              }
            }
          : baseData;

        console.log('✅ STEP 2 SUCCESS: Data prepared');
        console.log('📦 Final data structure:', {
          uid: newMember.uid,
          email: newMember.email,
          fullName: newMember.fullName,
          phoneNumber: newMember.phoneNumber,
          role: newMember.role,
          isActive: newMember.isActive,
          hasAddress: !!newMember.address,
          hasEmergencyContact: !!newMember.emergencyContact,
          dataSize: JSON.stringify(newMember).length + ' characters'
        });

        // 🔥 STEP 3: Save to Firestore
        console.log('🔄 STEP 3: Saving user data to Firestore...');
        
        const memberRef = doc(db, 'members', authUser.uid);
        
        // Check current auth state before save
        console.log('🔐 Current auth state before save:', {
          currentUser: auth.currentUser?.uid,
          isSignedIn: !!auth.currentUser,
          emailVerified: auth.currentUser?.emailVerified,
          matchesNewUser: auth.currentUser?.uid === authUser.uid,
          registrationFlag: isRegistering.current
        });

        let saveAttempts = 0;
        const maxRetries = 3;
        
        while (saveAttempts < maxRetries) {
          saveAttempts++;
          console.log(`📝 Save attempt ${saveAttempts}/${maxRetries}...`);
          
          try {
            await setDoc(memberRef, newMember);
            console.log(`✅ Save attempt ${saveAttempts}: SUCCESS`);
            break;
          } catch (saveError: any) {
            console.error(`❌ Save attempt ${saveAttempts}: FAILED`);
            console.error('Save error details:', {
              message: saveError.message,
              code: saveError.code,
              attempt: saveAttempts,
              currentUser: auth.currentUser?.uid || 'null'
            });
            
            if (saveAttempts >= maxRetries) {
              throw saveError;
            }
            
            // Wait before retry
            console.log(`⏳ Waiting ${1000 * saveAttempts}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * saveAttempts));
          }
        }

        // 🔥 STEP 4: Verify save was successful
        console.log('🔄 STEP 4: Verifying save...');
        
        // Wait a moment for Firestore consistency
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const verificationSnap = await getDoc(memberRef);
        
        if (!verificationSnap.exists()) {
          console.error('❌ VERIFICATION FAILED: Document does not exist after save');
          throw new Error('VERIFICATION_FAILED: Document was not saved to Firestore');
        }
        
        const savedData = verificationSnap.data();
        console.log('📋 Verification data check:', {
          hasUid: !!savedData.uid,
          hasEmail: !!savedData.email,
          hasFullName: !!savedData.fullName,
          hasPhoneNumber: !!savedData.phoneNumber,
          hasRole: !!savedData.role,
          isActive: savedData.isActive,
          matchesInput: savedData.uid === authUser.uid && savedData.email === sanitizedEmail
        });
        
        const hasRequiredFields = !!(savedData.fullName && savedData.phoneNumber && savedData.address);
        
        if (!hasRequiredFields) {
          console.error('❌ VERIFICATION FAILED: Required fields missing from saved document');
          throw new Error('VERIFICATION_FAILED: Required fields missing from saved document');
        }
        
        console.log('✅ STEP 4 SUCCESS: Save verification completed');

        // 🔥 STEP 5: Update application state
        console.log('🔄 STEP 5: Updating application state...');
        
        setUser(newMember);
        closeModals();

        // Log successful registration
        SimpleAuditLogger.logSecurityEvent(
          'REGISTER', 
          authUser.uid, 
          { email: sanitizedEmail, success: true },
          'LOW'
        );
        
        console.log('🎉 REGISTRATION COMPLETED SUCCESSFULLY');
        console.log('=================================');
        
      } catch (err: unknown) {
        console.error('💥 REGISTRATION FAILED');
        console.error('======================');
        console.error('Error details:', err);
        
        // 🔥 CRITICAL: Clean up Firebase Auth user if Firestore save failed
        if (authUser) {
          try {
            console.log('🗑️ CLEANUP: Removing Firebase Auth user...');
            await authUser.delete();
            console.log('✅ CLEANUP: Auth user removed successfully');
          } catch (deleteError: unknown) {
            console.error('❌ CLEANUP FAILED: Could not remove auth user');
            console.error('Delete error:', deleteError);
            
            const errorMessage = deleteError instanceof Error ? deleteError.message : String(deleteError);
            SimpleAuditLogger.logSecurityEvent(
              'SYSTEM',
              authUser.uid, 
              { error: errorMessage, context: 'auth_user_cleanup_failed' },
              'CRITICAL'
            );
          }
        }
        
        // Handle different error types
        let errorMessage = 'An error occurred during registration.';
        
        if (err instanceof Error) {
          const errorCode = (err as any).code;
          
          console.error('📋 Error analysis:', {
            message: err.message,
            code: errorCode,
            name: err.name,
            stack: err.stack
          });
          
          switch (errorCode || err.message) {
            case 'auth/email-already-in-use':
              errorMessage = 'This email address is already in use. Try logging in instead.';
              break;
            case 'auth/weak-password':
              errorMessage = 'Password is too weak. Must be at least 6 characters.';
              break;
            case 'auth/invalid-email':
              errorMessage = 'Invalid email address.';
              break;
            case 'permission-denied':
              errorMessage = 'Database permission denied. Please check configuration and try again.';
              break;
            case 'Database connection failed':
              errorMessage = 'Could not connect to database. Please check your internet connection.';
              break;
            case 'Database permission denied. Please check Firestore Rules configuration.':
              errorMessage = 'Database rules are blocking registration. Please contact support.';
              break;
            case 'VERIFICATION_FAILED: Document was not saved to Firestore':
              errorMessage = 'Registration failed - data could not be saved. Please try again.';
              break;
            case 'VERIFICATION_FAILED: Required fields missing from saved document':
              errorMessage = 'Registration failed - incomplete data. Please check all fields and try again.';
              break;
            default:
              errorMessage = err.message || 'Unknown error occurred during registration.';
          }

          // Log failed registration
          SimpleAuditLogger.logSecurityEvent(
            'REGISTER', 
            sanitizedEmail, 
            { success: false, error: err.message, code: errorCode },
            'HIGH'
          );
        }
        
        console.error('🎯 Final error message for user:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
        console.log('🏁 Registration process ended');
      }
      
    } finally {
      // 🆕 Clear registration flag to re-enable auth listener
      isRegistering.current = false;
      console.log('🔓 Registration flag cleared - auth listener re-enabled');
    }
  };

  // 🚪 Enhanced Logout Function
  const logout = async () => {
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      
      // 🆕 Log logout
      if (currentUser) {
        SimpleAuditLogger.logSecurityEvent(
          'LOGOUT', 
          currentUser.uid, 
          { method: 'manual' },
          'LOW'
        );
      }

      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      setUser(null); // Force cleanup
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