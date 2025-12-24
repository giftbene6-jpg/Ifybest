"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";

type Order = {
  _id: string;
  orderNumber: string;
  status: string;
  totalPrice: number;
  amountDiscount: number;
  orderDate: string;
  currency?: string;
  promoCode?: string;
  paystackReference?: string;
  paystackTransactionId?: string;
  products: Array<{
    quantity: number;
    price: number;
    name?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    image?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    product: { _id: string; name: string; price: number; currency: string; image?: any } | null;
  }>;
  customerName?: string;
  email?: string;
};

export default function OrderDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;

    async function fetchOrder() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/orders/${encodeURIComponent(id)}`);
        const data = await res.json();
        
        if (!data.order && retryCount < maxRetries) {
          retryCount++;
          setTimeout(fetchOrder, 2000); // Retry in 2 seconds
          return;
        }

        setOrder(data.order || null);
      } catch (err) {
        console.error("OrderDetails: Fetch error", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center py-24 bg-[#FDFCFA] border border-[#D4AF37]/10 mt-12 mb-24">
        <h1 className="text-3xl font-serif lux-gradient-text mb-6">Order Not Found</h1>
        <p className="text-gray-500 mb-10 font-light italic">The order you are looking for could not be located in our archives.</p>
        <Link href="/orders">
          <button className="bg-black text-white px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-all">
            Back to Orders
          </button>
        </Link>
      </div>
    );
  }

  const subtotal = (order.totalPrice || 0) + (order.amountDiscount || 0);

  return (
    <div className="max-w-5xl mx-auto p-6 py-16">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-[#D4AF37]/10 pb-8 gap-6">
        <div>
          <h1 className="text-5xl font-serif lux-gradient-text mb-4 tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
            Order Details
          </h1>
          <p className="text-gray-400 font-light tracking-[0.1em] uppercase text-[10px]">
            Reference: {order.orderNumber}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[#D4AF37] font-medium text-sm mb-1 tracking-widest">{new Date(order.orderDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}</p>
          <span className={`inline-block px-4 py-1 text-[10px] font-bold tracking-[0.2em] uppercase border ${
            order.status === 'paid' ? 'bg-[#D4AF37]/5 border-[#D4AF37]/30 text-[#D4AF37]' : 'bg-gray-50 border-gray-200 text-gray-500'
          }`}>
            {order.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Products */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white border border-[#D4AF37]/10 p-8 shadow-sm">
            <h2 className="text-xs font-bold tracking-[0.3em] uppercase mb-8 text-gray-400 border-b border-gray-50 pb-4">
              Your Selection
            </h2>
            <div className="space-y-8">
              {order.products.map((p, i) => {
                const productImg = p.image || p.product?.image;
                const productName = p.name || p.product?.name || "Bespoke Item";
                
                return (
                <div key={i} className="flex gap-8 group">
                  <div className="w-24 h-24 bg-[#FDFCFA] border border-gray-50 overflow-hidden shrink-0 relative">
                    {productImg && (
                      <Image
                        src={imageUrl(productImg).url()}
                        alt={productName}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-serif text-gray-800 mb-1">{productName}</h3>
                    <p className="text-xs text-gray-400 font-light mb-4 uppercase tracking-wider">Quantity: {p.quantity}</p>
                    <p className="text-[#D4AF37] font-medium tracking-wide">
                      {p.price.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-800 font-medium">
                      {(p.price * p.quantity).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
                    </p>
                  </div>
                </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#FDFCFA] border border-[#D4AF37]/10 p-8">
            <h2 className="text-xs font-bold tracking-[0.3em] uppercase mb-6 text-gray-400">
              Billing Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-light text-sm text-gray-600">
              <div>
                <p className="uppercase text-[10px] tracking-widest text-[#D4AF37] mb-2">Customer</p>
                <p className="text-gray-800 font-medium">{order.customerName}</p>
                <p className="italic">{order.email}</p>
              </div>
              <div>
                <p className="uppercase text-[10px] tracking-widest text-[#D4AF37] mb-2">Transaction ID</p>
                <p className="font-mono text-xs">{order.paystackTransactionId || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-4 h-fit sticky top-24">
          <div className="bg-white border border-[#D4AF37]/10 p-8 shadow-xl">
            <h2 className="text-xs font-bold tracking-[0.3em] uppercase mb-8 text-gray-400">
              Order Summary
            </h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>{subtotal.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}</span>
              </div>
              
              {order.amountDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span className="flex items-center gap-2 italic">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Promotion Applied
                  </span>
                  <span>-{order.amountDiscount.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}</span>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Grand Total</span>
                <span className="text-3xl font-serif lux-gradient-text tracking-tighter">
                  {order.totalPrice.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-50">
              <Link href="/orders" className="block text-center">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#D4AF37] hover:text-[#B8962E] transition-colors cursor-pointer">
                  ← Return to Collection
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
