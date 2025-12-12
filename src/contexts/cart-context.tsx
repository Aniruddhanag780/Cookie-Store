'use client';

import type { CartItem, Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, getDocs, writeBatch } from 'firebase/firestore';
import { products as allProducts } from '@/lib/products';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  totalItems: number;
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCartLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [localCart, setLocalCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const cartCollectionRef = useMemoFirebase(() => {
    if (user && firestore) {
      return collection(firestore, 'users', user.uid, 'cart');
    }
    return null;
  }, [user, firestore]);

  const { data: firestoreCart, isLoading: isFirestoreCartLoading } = useCollection<{id: string, quantity: number}>(cartCollectionRef);
  
  const isCartLoading = isUserLoading || isFirestoreCartLoading;

  useEffect(() => {
    if (user) {
      if (firestoreCart) {
        // User is logged in, and we have cart data from Firestore
        // Merge local cart into Firestore if local cart has items
        if (localCart.length > 0) {
          const batch = writeBatch(firestore);
          const newFirestoreCart = [...firestoreCart];

          localCart.forEach(localItem => {
            const firestoreItem = newFirestoreCart.find(item => item.id === localItem.id);
            if (firestoreItem) {
              // Item exists in Firestore, update quantity if local is greater
              const newQuantity = firestoreItem.quantity + localItem.quantity;
              const itemRef = doc(firestore, 'users', user.uid, 'cart', localItem.id);
              batch.update(itemRef, { quantity: newQuantity });
            } else {
              // Item does not exist in Firestore, add it
              const itemRef = doc(firestore, 'users', user.uid, 'cart', localItem.id);
              batch.set(itemRef, { id: localItem.id, quantity: localItem.quantity });
            }
          });

          batch.commit().then(() => {
            setLocalCart([]); // Clear local cart after merging
          });
        }
      }
    }
  }, [user, firestoreCart, localCart, firestore]);
  
  const cart = useMemo(() => {
    if (user) {
      if (!firestoreCart) return [];
      // Map firestore cart items (which are just {id, quantity}) to full CartItem objects
      return firestoreCart.map(item => {
        const productDetails = allProducts.find(p => p.id === item.id);
        return {
          ...productDetails!,
          quantity: item.quantity,
        };
      }).filter(Boolean) as CartItem[]; // Filter out any not found products
    }
    // If no user, use the local cart state
    return localCart;
  }, [user, firestoreCart, localCart]);


  const addToCart = async (product: Product, quantity = 1) => {
    if (user && firestore) {
      const cartItemRef = doc(firestore, 'users', user.uid, 'cart', product.id);
      const existingItem = cart.find(item => item.id === product.id);
      const newQuantity = (existingItem ? existingItem.quantity : 0) + quantity;
      await setDoc(cartItemRef, { id: product.id, quantity: newQuantity }, { merge: true });
    } else {
      setLocalCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.id === product.id);
        if (existingItem) {
          return prevCart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prevCart, { ...product, quantity }];
      });
    }
    toast({
      title: 'Added to Cart',
      description: `${product.name} is now in your cart.`,
    });
    setIsCartOpen(true);
  };

  const removeFromCart = async (productId: string) => {
    if (user && firestore) {
      const cartItemRef = doc(firestore, 'users', user.uid, 'cart', productId);
      await deleteDoc(cartItemRef);
    } else {
      setLocalCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    }
    toast({
      title: 'Item Removed',
      description: 'The item has been removed from your cart.',
      variant: 'destructive',
    });
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (user && firestore) {
        const cartItemRef = doc(firestore, 'users', user.uid, 'cart', productId);
        await setDoc(cartItemRef, { quantity: quantity }, { merge: true });
    } else {
      setLocalCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (user && firestore) {
        const cartColRef = collection(firestore, 'users', user.uid, 'cart');
        const cartSnapshot = await getDocs(cartColRef);
        const batch = writeBatch(firestore);
        cartSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    } else {
      setLocalCart([]);
    }
  };

  const cartTotal = useMemo(
    () =>
      cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  );

  const totalItems = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    totalItems,
    isCartOpen,
    setIsCartOpen,
    isCartLoading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};