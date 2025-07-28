// src/providers/fireBaseAuthProvider.tsx - COMPLETE VERSION WITH DEBUG
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
            // No Firestore record - sign out
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
          }
        } catch (err) {
          console.error('User data fetch error:', err);
          setUser(null);
          setError('An error occurred while fetching user information.');
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

  // 📝 Enhanced Register Function - WITH DETAILED DEBUG
  const register = async (email: string, password: string, userData: SignUpData) => {
    // 🆕 Enhanced input validation
    if (!email || !password || !userData.fullName || !userData.phoneNumber) {
      setError('Please fill in all required fields.');
      return;
    }

    // 🆕 Input sanitization
    const sanitizedEmail = SecurityValidator.sanitizeInput(email.toLowerCase()).trim();
    const sanitizedUserData = SecurityValidator.sanitizeForDatabase(userData) as SignUpData;

    // 🆕 Detailed validation
    if (!SecurityValidator.validateEmail(sanitizedEmail)) {
      setError('Invalid email format.');
      return;
    }

    if (!SecurityValidator.validatePhone(sanitizedUserData.phoneNumber)) {
      setError('Invalid phone number format.');
      return;
    }

    if (!SecurityValidator.validateString(sanitizedUserData.fullName, 2, 50)) {
      setError('Name must be between 2 and 50 characters.');
      return;
    }

    // 🆕 Password strength validation
    const passwordValidation = AuthSecurity.validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      setError(`Password requirements: ${passwordValidation.errors.join(', ')}`);
      return;
    }

    setError(null);
    setLoading(true);
    
    try {
      // Create Firebase Authentication user
      const result = await createUserWithEmailAndPassword(auth, sanitizedEmail, password);
      
      // 🔍 Check if Firestore record already exists (edge case)
      const existingMemberRef = doc(db, 'members', result.user.uid);
      const existingMemberSnap = await getDoc(existingMemberRef);
      
      if (existingMemberSnap.exists()) {
        // User already exists in Firestore, just set state
        const existingMember = existingMemberSnap.data() as MemberProfile;
        setUser(existingMember);
        closeModals();
        
        SimpleAuditLogger.logSecurityEvent(
          'LOGIN', 
          result.user.uid, 
          { email: sanitizedEmail, method: 'existing_user' },
          'LOW'
        );
        return;
      }
      
      // ✅ FIXED: Create Firestore member record without undefined values
      const baseData = {
        uid: result.user.uid,
        email: sanitizedEmail,
        fullName: sanitizedUserData.fullName.trim(),
        phoneNumber: sanitizedUserData.phoneNumber.trim(),
        role: 'member' as const,
        isActive: true,
        address: {
          street: sanitizedUserData.address.street.trim(),
          city: sanitizedUserData.address.city.trim(),
          state: sanitizedUserData.address.state.trim(),
          country: sanitizedUserData.address.country.trim(),
          zipCode: sanitizedUserData.address.zipCode.trim(),
        },
        awards: [],
        classRegistrations: [],
        parentId: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: result.user.uid,
        updatedBy: result.user.uid,
      };

      // ✅ FIXED: Only add emergencyContact if it has valid data
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
      
      // 🔍 DETAILED DEBUG: Save to Firestore with comprehensive debugging
      try {
        console.log('🔄 Starting Firestore save process...');
        console.log('📋 User ID:', result.user.uid);
        console.log('📧 Email:', sanitizedEmail);
        
        // Check Firebase Auth state
        console.log('🔐 Current auth user:', auth.currentUser?.uid);
        console.log('🔐 Auth token exists:', !!auth.currentUser);
        
        // Log the exact data we're trying to save (without sensitive info)
        const dataToLog = {
          uid: newMember.uid,
          email: newMember.email,
          fullName: newMember.fullName,
          phoneNumber: newMember.phoneNumber,
          role: newMember.role,
          isActive: newMember.isActive,
          hasAddress: !!newMember.address,
          hasEmergencyContact: !!newMember.emergencyContact,
          addressFields: newMember.address ? Object.keys(newMember.address) : [],
          emergencyContactFields: newMember.emergencyContact ? Object.keys(newMember.emergencyContact) : []
        };
        
        console.log('📦 Data structure to save:', dataToLog);
        
        // Check for undefined or invalid values
        const checkForUndefined = (obj: any, path = ''): string[] => {
          const undefinedPaths: string[] = [];
          
          for (const [key, value] of Object.entries(obj)) {
            const currentPath = path ? `${path}.${key}` : key;
            
            if (value === undefined) {
              undefinedPaths.push(currentPath);
            } else if (value && typeof value === 'object' && !Array.isArray(value) && value.constructor === Object) {
              undefinedPaths.push(...checkForUndefined(value, currentPath));
            }
          }
          
          return undefinedPaths;
        };
        
        const undefinedFields = checkForUndefined(newMember);
        if (undefinedFields.length > 0) {
          console.error('❌ FOUND UNDEFINED FIELDS:', undefinedFields);
          throw new Error(`Invalid data: undefined fields found: ${undefinedFields.join(', ')}`);
        } else {
          console.log('✅ Data validation passed: no undefined fields');
        }
        
        // Attempt to save
        console.log('💾 Attempting setDoc...');
        const memberRef = doc(db, 'members', newMember.uid);
        
        await setDoc(memberRef, newMember);
        
        console.log('✅ setDoc completed successfully');
        
        // Verification step
        console.log('🔍 Verifying document was saved...');
        const verifySnap = await getDoc(memberRef);
        
        if (verifySnap.exists()) {
          console.log('✅ VERIFICATION SUCCESS: Document exists in Firestore');
          console.log('📋 Saved document ID:', verifySnap.id);
          
          const savedData = verifySnap.data();
          console.log('📦 Verified saved data structure:', {
            uid: savedData.uid,
            email: savedData.email,
            role: savedData.role,
            isActive: savedData.isActive,
            hasAllFields: !!(savedData.fullName && savedData.phoneNumber && savedData.address)
          });
          
        } else {
          console.error('❌ VERIFICATION FAILED: Document does not exist after save');
          throw new Error('Document verification failed - save may not have completed');
        }
        
      } catch (firestoreError: any) {
        console.error('❌ FIRESTORE ERROR DETAILS:');
        console.error('Error message:', firestoreError.message);
        console.error('Error code:', firestoreError.code);
        console.error('Error stack:', firestoreError.stack);
        
        // Check specific error types
        if (firestoreError.code === 'permission-denied') {
          console.error('🚫 PERMISSION DENIED - Check Firestore Rules');
          console.error('Current user:', auth.currentUser?.uid);
          console.error('Trying to write to:', `members/${newMember.uid}`);
        }
        
        if (firestoreError.code === 'invalid-argument') {
          console.error('📝 INVALID ARGUMENT - Check data structure');
          console.error('Full newMember object:', JSON.stringify(newMember, null, 2));
        }
        
        if (firestoreError.code === 'unavailable') {
          console.error('🌐 SERVICE UNAVAILABLE - Network/Server issue');
        }
        
        // Clean up auth user
        try {
          console.log('🗑️ Cleaning up Auth user due to Firestore error...');
          await result.user.delete();
          console.log('✅ Auth user cleanup successful');
        } catch (deleteError) {
          console.error('❌ Auth user cleanup failed:', deleteError);
        }
        
        // Provide user-friendly error message
        let friendlyMessage = 'Failed to create user account. ';
        
        switch (firestoreError.code) {
          case 'permission-denied':
            friendlyMessage += 'Permission denied. Please try again or contact support.';
            break;
          case 'unavailable':
            friendlyMessage += 'Service temporarily unavailable. Please try again in a moment.';
            break;
          case 'invalid-argument':
            friendlyMessage += 'Invalid data provided. Please check your information.';
            break;
          default:
            friendlyMessage += `Database error (${firestoreError.code}). Please try again.`;
        }
        
        throw new Error(friendlyMessage);
      }
      
      // Update state
      setUser(newMember);
      closeModals();

      // 🆕 Log successful registration
      SimpleAuditLogger.logSecurityEvent(
        'REGISTER', 
        result.user.uid, 
        { email: sanitizedEmail, success: true },
        'LOW'
      );
      
    } catch (err: unknown) {
      let errorMessage = 'An error occurred during registration.';
      
      if (err instanceof Error) {
        const errorCode = (err as any).code;
        switch (errorCode || err.message) {
          case 'auth/email-already-in-use':
          case 'Firebase: Error (auth/email-already-in-use).':
            errorMessage = 'This email address is already in use. Try logging in instead.';
            break;
          case 'auth/weak-password':
          case 'Firebase: Error (auth/weak-password).':
            errorMessage = 'Password is too weak. Must be at least 6 characters.';
            break;
          case 'auth/invalid-email':
          case 'Firebase: Error (auth/invalid-email).':
            errorMessage = 'Invalid email address.';
            break;
          case 'permission-denied':
            errorMessage = 'Registration not allowed. Please check your internet connection and try again.';
            break;
          default:
            errorMessage = err.message;
        }

        // 🆕 Log failed registration
        SimpleAuditLogger.logSecurityEvent(
          'REGISTER', 
          sanitizedEmail, 
          { success: false, error: err.message, code: errorCode },
          'MEDIUM'
        );
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
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