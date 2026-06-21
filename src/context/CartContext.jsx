/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from "react";
import cartService from "../services/cartService";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch cart when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartItems([]);
      setTotalQuantity(0);
      setTotalPrice(0);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const response = await cartService.getMyCart();
      if (response && response.result) {
        setCartItems(response.result.cartItems || []);
        setTotalQuantity(response.result.totalQuantity || 0);
        setTotalPrice(response.result.totalPrice || 0);
      }
    } catch (error) {
      console.error("Lỗi khi tải giỏ hàng:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng!", { position: "top-center" });
      navigate("/login");
      return;
    }
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const response = await cartService.addToCart(productId, quantity);
      if (response && response.result) {
        setCartItems(response.result.cartItems || []);
        setTotalQuantity(response.result.totalQuantity || 0);
        setTotalPrice(response.result.totalPrice || 0);
        toast.success("Thêm vào giỏ hàng thành công!", { position: "top-center", autoClose: 2000 });
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ:", error);
      toast.error("Thêm vào giỏ thất bại. Vui lòng thử lại!", { position: "top-center" });
    } finally {
      setIsUpdating(false);
    }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const response = await cartService.updateCartItem(cartItemId, quantity);
      if (response && response.result) {
        setCartItems(response.result.cartItems || []);
        setTotalQuantity(response.result.totalQuantity || 0);
        setTotalPrice(response.result.totalPrice || 0);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
      toast.error("Cập nhật số lượng thất bại!", { position: "top-center" });
    } finally {
      setIsUpdating(false);
    }
  };

  const removeCartItem = async (cartItemId) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await cartService.removeCartItem(cartItemId);
      await fetchCart();
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng", { position: "top-center", autoClose: 2000 });
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error("Xóa sản phẩm thất bại!", { position: "top-center" });
    } finally {
      setIsUpdating(false);
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCartItems([]);
      setTotalQuantity(0);
      setTotalPrice(0);
      toast.success("Đã xóa toàn bộ giỏ hàng", { position: "top-center", autoClose: 2000 });
    } catch (error) {
      console.error("Lỗi khi làm sạch giỏ hàng:", error);
      toast.error("Thao tác thất bại!", { position: "top-center" });
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalQuantity,
        totalPrice,
        isLoading,
        isUpdating,
        fetchCart,
        addToCart,
        updateCartItem,
        removeCartItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
