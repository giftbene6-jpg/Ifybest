"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartProvider";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";
import { useUser, SignInButton } from "@clerk/nextjs";

import { validateCoupon } from "@/app/actions/validateCoupon";

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const { user } = useUser();

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <p className="text-gray-600 mb-4">Please sign in to proceed with checkout.</p>
        <SignInButton mode="redirect">
          <button className="bg-blue-600 text-white px-6 py-2 rounded">Sign In</button>
        </SignInButton>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <p className="text-gray-600">Your basket is empty. Add items to proceed.</p>
      </div>
    );
  }

  const applyPromoCode = async () => {
    if (!promoCode) return;
    try {
      const result = await validateCoupon(promoCode);
      if (result.isValid && result.discountAmount) {
        setDiscount(result.discountAmount / 100);
        setError("");
      } else {
        setDiscount(0);
        setError(result.message || "Invalid promo code");
        setTimeout(() => setError(""), 3000);
      }
    } catch (error) {
      console.error("Error applying promo code:", error);
      setDiscount(0);
      setError("Failed to apply promo code");
    }
  };

  const subtotal = totalPrice;
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;
  const totalInKobo = Math.round(total * 100); // Paystack expects amount in kobo

  const handlePayment = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      setError("Email not found. Please update your profile.");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      // Step 1: Create transaction on the server
      const orderResponse = await fetch("/api/checkout/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.primaryEmailAddress.emailAddress,
          amount: totalInKobo,
          items: items.map((it) => ({
            id: it.product._id,
            name: it.product.name,
            quantity: it.quantity,
            price: it.product.price,
            image: it.product.image,
          })),
          promoCode: promoCode || null,
          discount: discountAmount,
          clerkUserId: user.id,
          customerName: user.fullName || user.firstName || "",
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to initialize payment");
      }

      const orderData = await orderResponse.json();
      const { authorizationUrl } = orderData;

      // Step 2: Redirect to Paystack for payment
      if (authorizationUrl) {
        window.location.href = authorizationUrl;
      } else {
        throw new Error("No payment URL returned");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment initialization failed");
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <ul className="space-y-4">
            {items.map((it) => (
              <li
                key={it.product._id}
                className="flex items-start space-x-3 bg-white p-4 rounded shadow-sm"
              >
                <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0 relative">
                  {it.product.image && (
                    <Image
                      src={imageUrl(it.product.image).url()}
                      alt={it.product.name || "Product image"}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{it.product.name}</div>
                  <div className="text-sm text-gray-500">
                    ₦{(it.product.price ?? 0).toLocaleString("en-NG")}
                  </div>
                  <div className="text-sm text-gray-600">Qty: {it.quantity}</div>
                  <div className="text-sm text-gray-700 font-medium">
                    Subtotal: ₦{((it.product.price ?? 0) * it.quantity).toLocaleString("en-NG")}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Summary */}
        <aside className="bg-white p-6 rounded shadow-sm h-fit">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

          <div className="space-y-3 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">₦{subtotal.toLocaleString("en-NG")}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({Math.round(discount * 100)}%):</span>
                <span className="font-medium">-₦{discountAmount.toLocaleString("en-NG")}</span>
              </div>
            )}

            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>₦{total.toLocaleString("en-NG")}</span>
            </div>
          </div>

          {/* Promo Code */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Promo Code</label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 px-3 py-2 border rounded text-sm"
              />
              <button
                onClick={applyPromoCode}
                className="px-3 py-2 bg-gray-200 rounded text-sm font-medium hover:bg-gray-300"
              >
                Apply
              </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            <p className="text-xs text-gray-500 mt-1">Try: BFRIDAY</p>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-lg hover:shadow-lg transition disabled:opacity-50"
          >
            {processing ? "Processing..." : "Pay Now"}
          </button>

          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        </aside>
      </div>
    </div>
  );
}
