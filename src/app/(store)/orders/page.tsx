"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUser, SignInButton } from "@clerk/nextjs";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

type Order = {
  _id: string;
  orderNumber: string;
  status: string;
  totalPrice: number;
  amountDiscount: number;
  orderDate: string;
  products: Array<{
    quantity: number;
    productId: string;
    name: string;
    price: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    image?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    product: { _id: string; name: string; price: number; currency: string; image?: any } | null;
  }>;
};

export default function OrdersPage() {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/orders?clerkUserId=${encodeURIComponent(user.id)}`);
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center py-24 bg-[#FDFCFA] border border-[#D4AF37]/10 mt-12 mb-24">
        <h1 className="text-4xl font-serif lux-gradient-text mb-6 tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
          Your Collection
        </h1>
        <p className="text-gray-500 mb-10 font-light italic">Please sign in to view your exclusive order history.</p>
        <SignInButton mode="modal">
          <button className="bg-black text-white px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-all">
            Sign In
          </button>
        </SignInButton>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 pb-6 border-b border-[#D4AF37]/10">
        <h1 className="text-4xl font-serif lux-gradient-text tracking-tight mb-2 md:mb-0" style={{ fontFamily: 'var(--font-playfair)' }}>
          Order History
        </h1>
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#D4AF37]/60">
          {orders?.length || 0} Exquisite Pieces Secured
        </p>
      </div>

      <div className="space-y-8">
        {loading && (
          <div className="flex flex-col items-center py-24 space-y-4">
            <div className="w-8 h-8 border-2 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin"></div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Consulting Archive...</p>
          </div>
        )}
        
        {!loading && orders && orders.length === 0 && (
          <div className="bg-white border border-[#D4AF37]/10 p-16 text-center shadow-sm">
            <p className="text-gray-500 mb-8 font-light italic">Your collection is currently empty.</p>
            <Link href="/">
              <button className="bg-black text-white px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-all">
                Explore Collection
              </button>
            </Link>
          </div>
        )}

        {!loading && orders && orders.map((order) => (
          <div key={order._id} className="group bg-white border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all duration-500 shadow-sm overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-gray-50 pb-8">
                <div>
                  <div className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#D4AF37] mb-2">IDENTIFIER</div>
                  <p className="text-xl font-serif tracking-tight text-gray-900 mb-1">{order.orderNumber}</p>
                  <p className="text-[10px] text-gray-400 font-medium tracking-widest">{new Date(order.orderDate).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}</p>
                </div>
                <div className="md:text-right">
                  <div className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#D4AF37] mb-2">ESTATE</div>
                  <span className={`inline-block px-3 py-1 text-[9px] font-black tracking-widest uppercase border ${
                    order.status === 'paid' ? 'bg-[#D4AF37]/5 border-[#D4AF37]/20 text-[#D4AF37]' : 'bg-gray-50 border-gray-100 text-gray-400'
                  }`}>
                    {order.status}
                  </span>
                  <p className="text-2xl font-serif lux-gradient-text mt-3 tracking-tighter">₦{order.totalPrice.toLocaleString("en-NG")}</p>
                </div>
              </div>

              <div className="flex gap-4 overflow-x-auto mt-8 pb-4 scrollbar-hide">
                {order.products?.map((product) => {
                  const image = product.image || product.product?.image;
                  return (
                    <div key={`${order._id}-${product.productId}`} className="relative h-28 w-28 flex-shrink-0 bg-gray-50 border border-gray-50 grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer">
                      {image && (
                        <Image
                          src={urlFor(image).url()}
                          alt={product.name || "Product"}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-gray-50">
                <div className="flex space-x-8">
                   <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400">
                    VOLUME: <span className="text-gray-900 ml-1">{order.products?.reduce((acc, p) => acc + (p.quantity || 1), 0)}</span>
                  </div>
                  <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400">
                    ITEMS: <span className="text-gray-900 ml-1">{order.products?.length || 0}</span>
                  </div>
                </div>
                
                <Link href={`/orders/${encodeURIComponent(order.orderNumber)}`}>
                  <button className="px-8 py-3 bg-white border border-black text-black text-[9px] font-bold tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-all duration-500">
                    Examine Portfolio
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
