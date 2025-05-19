import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Función para obtener el carrito del usuario actual
  const fetchCart = useCallback(async (userId) => {
    if (!userId || userId === "undefined" || userId === "null") {
      console.log("No hay usuario identificado. ID:", userId);
      setCartItems([]);
      return;
    }

    setLoading(true);
    setError(null);

    console.log("Intentando cargar carrito para userId:", userId);

    try {
      const response = await fetch(`http://localhost:3000/carrito/${userId}`);

      if (!response.ok) {
        throw new Error(`Error al cargar el carrito (${response.status})`);
      }

      const data = await response.json();

      // Transformar los datos del servidor al formato que espera el frontend
      const formattedItems = data.items?.map(item => ({
        ...item,
        quantity: item.cantidad,
        id_producto: item.id_producto
      })) || [];

      setCartItems(formattedItems);
    } catch (error) {
      console.error("Error al cargar carrito:", error);
      setError("No se pudo cargar el carrito. Intenta de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Refrescar el carrito manualmente
  const refreshCart = useCallback((userId) => {
    if (userId) {
      fetchCart(userId);
    }
  }, [fetchCart]);

  // Escuchar cambios de usuario
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    console.log("CartContext inicializado, userId:", userId);
    
    if (userId && userId !== "undefined" && userId !== "null") {
      setCurrentUserId(userId);
      fetchCart(userId);
    } else {
      console.error("No se encontró un ID de usuario válido en localStorage");
    }

    // Escuchar evento de cambio de usuario (desde loginCliente)
    const handleUserChange = (event) => {
      const newUserId = event.detail.userId;
      setCurrentUserId(newUserId);
      fetchCart(newUserId);
    };

    window.addEventListener('userChanged', handleUserChange);

    return () => {
      window.removeEventListener('userChanged', handleUserChange);
    };
  }, [fetchCart]);

  // Agregar producto al carrito
  const addToCart = async (product) => {
    if (!currentUserId) {
      setError("Debes iniciar sesión para agregar productos al carrito");
      return;
    }

    console.log("Intentando agregar producto:", product);
    setLoading(true);
    setError(null);

    try {
      const requestBody = {
        id_producto: product.id_producto,
        cantidad: 1
      };
      console.log("Enviando al servidor:", requestBody);

      const response = await fetch(`http://localhost:3000/carrito/${currentUserId}/item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      // Capturar el texto de respuesta para diagnóstico
      const responseText = await response.text();
      console.log("Respuesta del servidor:", response.status, responseText);

      if (!response.ok) {
        throw new Error(`Error al agregar al carrito (${response.status}): ${responseText}`);
      }

      // Actualizar UI después de confirmación del servidor
      await fetchCart(currentUserId);
    } catch (error) {
      console.error("Error detallado al agregar al carrito:", error);
      setError("No se pudo agregar el producto al carrito");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar producto del carrito
  const removeFromCart = async (productId) => {
    if (!currentUserId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3000/carrito/${currentUserId}/item/${productId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar del carrito (${response.status})`);
      }

      // Actualizar UI después de confirmación del servidor
      await fetchCart(currentUserId);
    } catch (error) {
      console.error("Error al eliminar del carrito:", error);
      setError("No se pudo eliminar el producto del carrito");
    } finally {
      setLoading(false);
    }
  };

  // Actualizar cantidad de un producto
  const updateQuantity = async (productId, newQuantity) => {
    if (!currentUserId) return;

    if (newQuantity < 1) {
      return removeFromCart(productId);
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3000/carrito/${currentUserId}/item/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad: newQuantity })
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar cantidad (${response.status})`);
      }

      // Actualizar UI después de confirmación del servidor
      await fetchCart(currentUserId);
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
      setError("No se pudo actualizar la cantidad");
    } finally {
      setLoading(false);
    }
  };

  // Vaciar carrito
  const clearCart = async () => {
    if (!currentUserId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3000/carrito/${currentUserId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Error al vaciar el carrito (${response.status})`);
      }

      setCartItems([]);
    } catch (error) {
      console.error("Error al vaciar el carrito:", error);
      setError("No se pudo vaciar el carrito");
    } finally {
      setLoading(false);
    }
  };

  // Calcular total del carrito
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.precio_producto) || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  // Obtener número total de items
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      error,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getTotalItems,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);