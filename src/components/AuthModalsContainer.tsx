// src/components/AuthModalsContainer.tsx - CENTRALIZED MODAL MANAGEMENT
import React from 'react';
import { useFirebaseAuth } from '../providers/fireBaseAuthProvider';
import LoginModal from '../modals/LoginModal';
import SignUpModal from '../modals/SignUpModal';

/**
 * 🎯 Authentication Modals Container
 * 
 * Bu component tüm authentication modal'larını merkezi olarak yönetir.
 * Firebase Auth Provider'dan modal state'lerini alır ve ilgili modal'ları render eder.
 * 
 * Usage: Bu component'i _app.tsx veya layout component'inde kullanın.
 */
const AuthModalsContainer: React.FC = () => {
  const { 
    isLoginModalOpen, 
    isSignUpModalOpen, 
    closeModals 
  } = useFirebaseAuth();

  return (
    <>
      {/* 🔐 Login Modal */}
      <LoginModal
        open={isLoginModalOpen}
        onClose={closeModals}
      />

      {/* 📝 Sign Up Modal */}
      <SignUpModal
        open={isSignUpModalOpen}
        onClose={closeModals}
      />
    </>
  );
};

export default AuthModalsContainer;