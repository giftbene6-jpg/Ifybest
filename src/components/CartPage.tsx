"use client";

import React from "react";
import { useCart } from "@/context/CartProvider";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";
import { useUser, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice, discountedTotal, activeSale, clearCart } = useCart();
  const { isSignedIn } = useUser();

  const discountAmount = activeSale?.isActive ? activeSale.discountAmount : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-[60vh]">
      <div className="flex items-center space-x-4 mb-10 pb-6 border-b border-gray-100">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Your Basket</h1>
        <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-bold">
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="py-24 text-center">
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your basket is empty</h2>
          <p className="text-gray-500 mb-8">Go find something amazing to add!</p>
          <Link href="/">
            <button className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-purple-700 transition-all">
              Start Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <ul className="space-y-6">
              {items.map((it) => {
                const itemPrice = it.product.price ?? 0;
                const itemDiscountedPrice = discountAmount > 0 ? itemPrice * (1 - discountAmount / 100) : itemPrice;

                return (
                  <li key={it.product._id} className="flex items-start space-x-6 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 relative">
                      {it.product.image && (
                        <Image
                          src={imageUrl(it.product.image).url()}
                          alt={it.product.name || "Product image"}
                          width={96}
                          height={96}
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-lg text-gray-900 mb-1">{it.product.name}</div>
                          <div className="flex flex-col">
                             {discountAmount > 0 && (
                               <span className="text-xs text-gray-400 line-through">₦{itemPrice.toLocaleString("en-NG")}</span>
                             )}
                             <div className="text-sm text-purple-600 font-bold mb-2">₦{itemDiscountedPrice.toLocaleString("en-NG")}</div>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(it.product._id)} className="text-gray-400 hover:text-red-500 transition-colors p-2 bg-gray-50 rounded-lg">
                          <span className="text-xl">🗑</span>
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3 bg-gray-50 p-1 rounded-lg">
                          <button
                            onClick={() => updateQuantity(it.product._id, it.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-md shadow-sm hover:border-purple-400 text-gray-600 transition-colors"
                          >
                            -
                          </button>
                          <div className="text-sm font-bold w-4 text-center text-gray-800">{it.quantity}</div>
                          <button
                            onClick={() => updateQuantity(it.product._id, it.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-md shadow-sm hover:border-purple-400 text-gray-600 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-xs font-bold text-gray-400">
                          Subtotal: <span className="text-gray-900 font-black">₦{(itemDiscountedPrice * it.quantity).toLocaleString("en-NG")}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <aside className="bg-white border border-gray-100 p-8 rounded-3xl shadow-xl h-fit sticky top-24">
            <h4 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Order Summary</h4>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Items ({totalItems})</span>
                <span className="text-gray-900 font-bold">₦{totalPrice.toLocaleString("en-NG")}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-red-500 font-bold">
                  <span>Holiday Discount (-{discountAmount}%)</span>
                  <span>-₦{(totalPrice - discountedTotal).toLocaleString("en-NG")}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-3xl font-black text-purple-600 tracking-tight">₦{discountedTotal.toLocaleString("en-NG")}</span>
              </div>
            </div>

            <div className="space-y-4">
              {!isSignedIn ? (
                <div className="space-y-4">
                  <SignInButton mode="redirect">
                    <button className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold shadow-lg hover:bg-purple-700 transition-all">Sign In to Order</button>
                  </SignInButton>
                  <button onClick={clearCart} className="w-full text-xs font-bold text-gray-400 hover:text-red-500 transition-colors">Clear All</button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Link href="/checkout" className="block">
                    <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
                      Proceed to Checkout
                    </button>
                  </Link>
                  <button onClick={clearCart} className="w-full text-xs font-bold text-gray-400 hover:text-red-500 transition-colors">Clear All</button>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
