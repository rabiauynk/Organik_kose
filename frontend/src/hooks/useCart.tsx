
import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiService } from '../services/api';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadCartFromBackend = async () => {
      try {
        const backendCartItems = await apiService.getCartItems();
        console.log('Loaded cart from backend:', backendCartItems);

        // Convert backend cart items to frontend format
        const formattedItems: CartItem[] = backendCartItems.map((item: any) => ({
          id: item.product.id.toString(),
          name: item.product.isim,
          price: parseFloat(item.product.fiyat),
          quantity: item.quantity,
          image: item.product.resimUrl || '/placeholder-image.jpg'
        }));

        setCartItems(formattedItems);
      } catch (error) {
        console.error('Error loading cart from backend:', error);
        // Fallback to localStorage if backend fails
        const savedCart = localStorage.getItem('organikKoseCart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      }
    };

    loadCartFromBackend();
  }, []);

  useEffect(() => {
    localStorage.setItem('organikKoseCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (product: Omit<CartItem, 'quantity'>) => {
    try {
      console.log('Adding to cart:', product);

      // Call backend API first
      await apiService.addToCart(parseInt(product.id), 1);
      console.log('Successfully added to backend cart');

      // Reload cart from backend to get accurate data
      const backendCartItems = await apiService.getCartItems();
      const formattedItems: CartItem[] = backendCartItems.map((item: any) => ({
        id: item.product.id.toString(),
        name: item.product.isim,
        price: parseFloat(item.product.fiyat),
        quantity: item.quantity,
        image: item.product.resimUrl || '/placeholder-image.jpg'
      }));

      setCartItems(formattedItems);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Sepete ürün eklenirken hata oluştu: ' + (error as any).message);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      await apiService.removeFromCart(parseInt(productId));

      // Reload cart from backend
      const backendCartItems = await apiService.getCartItems();
      const formattedItems: CartItem[] = backendCartItems.map((item: any) => ({
        id: item.product.id.toString(),
        name: item.product.isim,
        price: parseFloat(item.product.fiyat),
        quantity: item.quantity,
        image: item.product.resimUrl || '/placeholder-image.jpg'
      }));

      setCartItems(formattedItems);
    } catch (error) {
      console.error('Error removing from cart:', error);
      // Fallback to local removal
      setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }

      await apiService.updateCartItemQuantity(parseInt(productId), quantity);

      // Reload cart from backend
      const backendCartItems = await apiService.getCartItems();
      const formattedItems: CartItem[] = backendCartItems.map((item: any) => ({
        id: item.product.id.toString(),
        name: item.product.isim,
        price: parseFloat(item.product.fiyat),
        quantity: item.quantity,
        image: item.product.resimUrl || '/placeholder-image.jpg'
      }));

      setCartItems(formattedItems);
    } catch (error) {
      console.error('Error updating quantity:', error);
      // Fallback to local update
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = async () => {
    try {
      await apiService.clearCart();
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      // Still clear local cart for better UX
      setCartItems([]);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
