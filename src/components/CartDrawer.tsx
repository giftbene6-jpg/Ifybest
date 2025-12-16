"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartProvider";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";
import { useUser, SignInButton } from "@clerk/nextjs";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, totalItems, totalPrice, clearCart } = useCart();
  const { isSignedIn } = useUser();
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1" onClick={closeCart} />
      <aside className="w-96 bg-white shadow-xl p-4 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Your Basket</h3>
          <button onClick={closeCart} className="text-gray-500">✕</button>
        </div>

        {items.length === 0 ? (
          <div className="py-12 text-center text-gray-600">Your basket is empty</div>
        ) : (
          <div>
            <ul className="space-y-4">
              {items.map((it) => (
                <li key={it.product._id} className="flex items-start space-x-3">
                  <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0 relative">
                    {it.product.image && (
                      <Image
                        src={imageUrl(it.product.image).url()}
                        alt={it.product.name || "Product image"}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">{it.product.name}</div>
                        <div className="text-sm text-gray-500">₦{(it.product.price ?? 0).toLocaleString("en-NG")}</div>
                        <div className="text-sm text-gray-700">Subtotal: ₦{( (it.product.price ?? 0) * it.quantity ).toLocaleString("en-NG")}</div>
                      </div>
                      <button onClick={() => removeFromCart(it.product._id)} className="text-red-500">🗑</button>
                    </div>

                    <div className="mt-2 flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(it.product._id, it.quantity - 1)}
                        className="px-2 py-1 border rounded"
                      >
                        -
                      </button>
                      <div className="px-3">{it.quantity}</div>
                      <button
                        onClick={() => updateQuantity(it.product._id, it.quantity + 1)}
                        className="px-2 py-1 border rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t pt-4">
              <h4 className="font-semibold">Order Summary</h4>
              <div className="flex justify-between mt-2">
                <span className="text-sm text-gray-600">Items ({totalItems})</span>
                <span className="font-medium">₦{totalPrice.toLocaleString("en-NG")}</span>
              </div>

              <div className="mt-4">
                {!isSignedIn ? (
                  <div className="space-y-2">
                    <SignInButton mode="redirect">
                      <button className="w-full py-2 bg-blue-600 text-white rounded">Sign in to Checkout</button>
                    </SignInButton>
                    <button onClick={clearCart} className="w-full py-2 text-sm text-gray-600">Clear Basket</button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setProcessing(true);
                        setTimeout(() => {
                          setProcessing(false);
                          // For now just clear the cart and close
                          clearCart();
                          closeCart();
                          alert("Order processed (demo)");
                        }, 1500);
                      }}
                      className="w-full py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded font-semibold"
                      disabled={processing}
                    >
                      {processing ? "Processing..." : "Checkout"}
                    </button>
                    <button onClick={clearCart} className="w-full py-2 text-sm text-gray-600">Clear Basket</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
