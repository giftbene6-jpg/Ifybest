"use client";

import React, { useState, useRef, useEffect } from "react";
import { Product } from "../../sanity.types";
import { useCart } from "@/context/CartProvider";

interface AddToBasketButtonProps {
  product: Product;
  disabled?: boolean;
}

const AddToBasketButton: React.FC<AddToBasketButtonProps> = ({ product, disabled }) => {
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current as number);
    };
  }, []);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if inside a link
    e.stopPropagation(); // Stop event bubbling

    if (!disabled) {
      addToCart(product, 1);
      setShowToast(true);
      if (toastTimer.current) window.clearTimeout(toastTimer.current as number);
      toastTimer.current = window.setTimeout(() => setShowToast(false), 1600);
    }
  };

  return (
    <div className="relative w-full">
      <button
        onClick={handleAddToCart}
        disabled={disabled}
        className={`w-full py-2 rounded text-white font-semibold ${
          disabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:shadow-lg transition-shadow"
        }`}
      >
        {disabled ? "Out of stock" : "Add to basket"}
      </button>

      {/* Toast (fixed top-center) */}
      <div
        role="status"
        aria-live="polite"
        aria-hidden={!showToast}
        className={`pointer-events-none fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-lg bg-green-600 text-white text-lg font-bold shadow-2xl z-50 transition-all duration-300 ${
          showToast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
        }`}
      >
        Added to Basket
      </div>
    </div>
  );
};

export default AddToBasketButton;
