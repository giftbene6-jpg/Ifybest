"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartProvider";
import { CheckmarkCircleIcon } from "@sanity/icons";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const { clearCart } = useCart();

  const [isVerifying, setIsVerifying] = React.useState(true);

  useEffect(() => {
    async function verifyPayment() {
      if (!reference) {
        setIsVerifying(false);
        return;
      }
      try {
        const res = await fetch(`/api/checkout/verify?reference=${encodeURIComponent(reference)}`);
        if (!res.ok) throw new Error("Verification failed");
        
        clearCart();
      } catch (err) {
        console.error("SuccessPage: Error verifying payment", err);
      } finally {
        setIsVerifying(false);
      }
    }
    
    verifyPayment();
  }, [reference, clearCart]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-[#FDFCFA]">
      <div className="max-w-md w-full bg-white border border-[#D4AF37]/10 p-12 rounded-none shadow-2xl text-center transform transition-all duration-700 hover:scale-[1.01]">
        <div className="flex justify-center mb-8">
            <div className="p-4 bg-[#D4AF37]/10 rounded-full">
                <CheckmarkCircleIcon className="w-16 h-16 text-[#D4AF37]" />
            </div>
        </div>
        
        <h1 className="text-4xl font-serif lux-gradient-text mb-4 tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
            Payment Successful
        </h1>
        
        <p className="text-gray-600 mb-8 leading-relaxed font-light italic">
            Thank you for your purchase. Your order has been received and is being processed by our artisans.
        </p>

        {reference && (
          <div className="bg-[#FDFCFA] border border-[#D4AF37]/20 p-4 mb-10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] mb-1">REFERENCE NUMBER</p>
            <p className="font-mono text-sm font-bold text-gray-800">{reference}</p>
          </div>
        )}

        <div className="space-y-4">
          <Link href={`/orders/${reference}`} className="block">
            <button 
              disabled={isVerifying}
              className="w-full py-4 bg-black text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Finalizing Order...
                </>
              ) : (
                "View Order Details"
              )}
            </button>
          </Link>
          
          <Link href="/" className="block">
            <button className="w-full py-4 border border-black text-black text-xs font-bold tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all duration-300">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
