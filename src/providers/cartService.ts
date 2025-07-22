import { db } from '../utils/fireBaseAuthProvider';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { CartItem } from './cartProvider'; // doğru path'e göre güncelle

export const getCartFromFirestore = async (userId: string): Promise<CartItem[]> => {
  const cartRef = doc(db, 'carts', userId);
  const snap = await getDoc(cartRef);
  if (snap.exists()) {
    return snap.data().items || [];
  }
  return [];
};

export const saveCartToFirestore = async (userId: string, items: CartItem[]) => {
  const cartRef = doc(db, 'carts', userId);
  await setDoc(cartRef, {
    userId,
    items,
    updatedAt: new Date().toISOString(),
  });
};
