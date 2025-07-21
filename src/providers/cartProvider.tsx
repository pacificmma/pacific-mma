import React, { createContext, useReducer, useEffect, ReactNode, Dispatch, useCallback } from 'react';
import { useFirebaseAuth } from '../providers/fireBaseAuthProvider';
import { auth, db } from '../utils/fireBaseAuthProvider';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';

// 🎯 Sepet ürün tipi
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image?: string;
  // Benzersiz key için composite key oluştur
  cartItemId?: string;
}

// 🎯 Context state tipi
interface CartState {
  items: CartItem[];
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  lastSyncTime: string | null;
}

// 🎯 Cart Actions
type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_CART'; payload: { items: CartItem[]; lastSyncTime?: string } }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { cartItemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'RESET_STATE' };

// 🎯 Context tipi
interface CartContextType {
  state: CartState;
  dispatch: Dispatch<CartAction>;
  addItem: (item: Omit<CartItem, 'cartItemId'>) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

// 🎯 Benzersiz cart item ID oluşturucu
const generateCartItemId = (item: Omit<CartItem, 'cartItemId'>): string => {
  return `${item.id}-${item.size}-${item.color}`;
};

// 🎯 Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'LOAD_CART':
      return { 
        ...state, 
        items: action.payload.items || [], 
        isLoaded: true, 
        isLoading: false,
        error: null,
        lastSyncTime: action.payload.lastSyncTime || null
      };
    
    case 'ADD_ITEM': {
      const newItem = action.payload;
      const cartItemId = newItem.cartItemId || generateCartItemId(newItem);
      
      const existingIndex = state.items.findIndex(item => 
        item.cartItemId === cartItemId
      );

      if (existingIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + newItem.quantity
        };
        return { ...state, items: updatedItems };
      } else {
        const itemWithId = { ...newItem, cartItemId };
        return { ...state, items: [...state.items, itemWithId] };
      }
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.cartItemId !== action.payload)
      };
    
    case 'UPDATE_QUANTITY': {
      const { cartItemId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Miktar 0 veya negatifse ürünü kaldır
        return {
          ...state,
          items: state.items.filter(item => item.cartItemId !== cartItemId)
        };
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity }
            : item
        )
      };
    }
    
    case 'CLEAR_CART':
      return { ...state, items: [] };
    
    case 'RESET_STATE':
      return { 
        items: [], 
        isLoaded: false, 
        isLoading: false,
        error: null,
        lastSyncTime: null
      };
    
    default:
      return state;
  }
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { user } = useFirebaseAuth();
  const [state, dispatch] = useReducer(cartReducer, { 
    items: [], 
    isLoaded: false, 
    isLoading: false,
    error: null,
    lastSyncTime: null
  });

  // 🎯 Kullanıcı değiştiğinde state'i temizle
  useEffect(() => {
    if (!user?.uid) {
      dispatch({ type: 'RESET_STATE' });
    }
  }, [user?.uid]);

  // 🎯 Firestore'dan sepeti yükle ve real-time dinle
  useEffect(() => {
    if (!user?.uid) {
      dispatch({ type: 'LOAD_CART', payload: { items: [] } });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    const cartRef = doc(db, 'carts', user.uid);

    console.log(`🛒 Kullanıcı ${user.uid} için sepet dinleyicisi başlatılıyor...`);

    const unsubscribe = onSnapshot(
      cartRef, 
      (docSnap) => {
        try {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const items = data.items || [];
            const lastSyncTime = data.updatedAt || data.lastSyncTime;
            
            console.log(`🔄 Sepet güncellendi: ${items.length} ürün`);
            
            // Cart item ID'leri eksikse ekle
            const itemsWithIds = items.map((item: CartItem) => ({
              ...item,
              cartItemId: item.cartItemId || generateCartItemId(item)
            }));
            
            dispatch({ 
              type: 'LOAD_CART', 
              payload: { 
                items: itemsWithIds, 
                lastSyncTime 
              } 
            });
          } else {
            console.log('📭 Sepet boş veya mevcut değil');
            dispatch({ type: 'LOAD_CART', payload: { items: [] } });
          }
        } catch (error) {
          console.error('❌ Cart yüklenirken hata:', error);
          dispatch({ type: 'SET_ERROR', payload: 'Sepet yüklenirken bir hata oluştu' });
        }
      },
      (error) => {
        console.error('❌ Firestore listener hatası:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Bağlantı hatası' });
      }
    );

    return () => {
      console.log('🔌 Sepet dinleyicisi kapatılıyor...');
      unsubscribe();
    };
  }, [user?.uid]);

  // 🎯 Firestore'a kaydet (optimized debounce)
  useEffect(() => {
    if (!user?.uid || !state.isLoaded) return;
    
    const timeoutId = setTimeout(async () => {
      try {
        const cartRef = doc(db, 'carts', user.uid);
        
        console.log(`💾 Sepet kaydediliyor: ${state.items.length} ürün`);
        
        await setDoc(cartRef, { 
          userId: user.uid,
          items: state.items,
          updatedAt: new Date().toISOString(),
          lastSyncTime: serverTimestamp(), // Server timestamp for better sync
          deviceInfo: {
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
          }
        }, { merge: true });
        
        console.log('✅ Sepet başarıyla kaydedildi');
        
      } catch (error) {
        console.error('❌ Sepet kaydedilirken hata:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Sepet kaydedilirken bir hata oluştu' });
      }
    }, 300); // Daha hızlı sync için 300ms

    return () => clearTimeout(timeoutId);
  }, [user?.uid, state.items, state.isLoaded]);

  // 🎯 Memoized functions
  const addItem = useCallback((item: Omit<CartItem, 'cartItemId'>) => {
    const cartItemId = generateCartItemId(item);
    console.log(`➕ Sepete ekleniyor: ${item.name} (${item.size}/${item.color})`);
    
    dispatch({ 
      type: 'ADD_ITEM', 
      payload: { 
        ...item, 
        cartItemId,
        quantity: Math.max(1, item.quantity) 
      } 
    });
  }, []);

  const removeItem = useCallback((cartItemId: string) => {
    console.log(`🗑️ Sepetten kaldırılıyor: ${cartItemId}`);
    dispatch({ type: 'REMOVE_ITEM', payload: cartItemId });
  }, []);

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    console.log(`🔢 Miktar güncelleniyor: ${cartItemId} -> ${quantity}`);
    dispatch({ type: 'UPDATE_QUANTITY', payload: { cartItemId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    console.log('🧹 Sepet temizleniyor');
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const getTotalItems = useCallback(() => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  }, [state.items]);

  const getTotalPrice = useCallback(() => {
    return state.items.reduce((total: number, item) => total + (item.price * item.quantity), 0);
  }, [state.items]);

  const contextValue: CartContextType = {
    state,
    dispatch,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// 🎯 Custom hook
export const useCart = () => {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// 🎯 Selector hooks (performans için)
export const useCartItems = () => {
  const { state } = useCart();
  return state.items;
};

export const useCartTotal = () => {
  const { getTotalItems, getTotalPrice } = useCart();
  return { totalItems: getTotalItems(), totalPrice: getTotalPrice() };
};

export const useCartStatus = () => {
  const { state } = useCart();
  return { 
    isLoading: state.isLoading, 
    isLoaded: state.isLoaded, 
    error: state.error,
    lastSyncTime: state.lastSyncTime
  };
};