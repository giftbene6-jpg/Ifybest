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
        className={`w-full py-3 px-6 rounded-xl text-sm font-bold transition-all duration-300 shadow-md ${
          disabled
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
        }`}
      >
        {disabled ? "Sold Out" : "Add to Basket"}
      </button>

      {/* Toast Notification */}
      <div
        role="status"
        aria-live="polite"
        aria-hidden={!showToast}
        className={`pointer-events-none fixed bottom-12 left-1/2 transform -translate-x-1/2 px-8 py-3 bg-gray-900 text-white text-sm font-bold rounded-full shadow-2xl z-50 transition-all duration-500 ${
          showToast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        ✨ Added to your Basket!
      </div>
    </div>
  );
}

export default AddToBasketButton;
