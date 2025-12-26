"use client"

import { ClerkLoaded, SignedIn, SignInButton, UserButton, useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartProvider";
import { PackageIcon, TrolleyIcon, SearchIcon } from "@sanity/icons";





function Header() {
/**
TO KNOW IF USER IS LOGGED IN
 */
  const { user } = useUser();
  const { totalItems } = useCart();
  const [orderCount, setOrderCount] = useState<number>(0);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchOrders() {
      if (!user?.id) {
        setOrderCount(0);
        return;
      }
      try {
        const res = await fetch(`/api/orders?clerkUserId=${encodeURIComponent(user.id)}`);
        if (!res.ok) return;
        const json = await res.json();
        if (!mounted) return;
        setOrderCount(Array.isArray(json.orders) ? json.orders.length : 0);
      } catch (e) {
        console.error("Header: Error fetching orders", e);
      }
    }
    fetchOrders();
    
    // Optional: Refresh periodically or on focus
    const interval = setInterval(fetchOrders, 30000);
    return () => { 
      mounted = false;
      clearInterval(interval);
    };
  }, [user?.id]);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#D4AF37]/10 px-4 sm:px-12 py-3 sm:py-4 transition-all duration-500">
      <div className="max-w-7xl mx-auto flex flex-col gap-y-3 sm:gap-y-4">
        {/* Top Row: Logo and Icons */}
        <div className="flex justify-between items-center w-full">
          {/* Brand Section */}
          <Link 
            href="/"
            className="text-2xl sm:text-4xl font-serif tracking-widest lux-gradient-text hover:scale-105 transition-all duration-500 font-medium"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            IFYBEST
          </Link>

          {/* Navigation & User Area */}
          <div className="flex items-center space-x-3 sm:space-x-10">
            <Link
              href="/basket"
              className="group relative flex items-center space-x-2 text-gray-800 transition-all duration-500"
            >
              <div className="relative">
                <TrolleyIcon className="w-5 h-5 sm:w-6 sm:h-6 group-hover:text-[#D4AF37] transition-colors"/>
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-black text-[#D4AF37] text-[7px] sm:text-[8px] font-bold w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-none flex items-center justify-center border border-[#D4AF37]/20 shadow-lg animate-in zoom-in duration-300">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase hidden lg:block group-hover:text-[#D4AF37] transition-colors">Collection</span>
            </Link>

            {/* user area */}
            <ClerkLoaded>
              <SignedIn>
                <Link 
                  href="/orders" 
                  className="group relative flex items-center space-x-2 text-gray-800 transition-all duration-500"
                >
                  <div className="relative">
                    <PackageIcon className="w-5 h-5 sm:w-6 sm:h-6 group-hover:text-[#D4AF37] transition-colors"/>
                    {orderCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-[#D4AF37] text-white text-[7px] sm:text-[8px] font-bold w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-none flex items-center justify-center border border-white shadow-lg animate-in zoom-in duration-300">
                        {orderCount}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase hidden lg:block group-hover:text-[#D4AF37] transition-colors">Orders</span>
                </Link>
              </SignedIn>

              {user ? (
                <div className="flex items-center border-l border-[#D4AF37]/10 pl-3 sm:pl-10 h-6 sm:h-8">
                  <UserButton 
                    appearance={{ 
                      elements: { 
                        userButtonAvatarBox: "w-8 h-8 sm:w-9 sm:h-9 border border-[#D4AF37]/10 p-0.5 hover:border-[#D4AF37]/40 transition-all duration-500" 
                      } 
                    }} 
                  />
                </div>
              ) : (
                <div className="border-l border-[#D4AF37]/10 pl-3 sm:pl-10">
                  <SignInButton mode="modal">
                    <button className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase lux-gradient-text hover:opacity-70 transition-all">Sign In</button>
                  </SignInButton>
                </div>
              )}
            </ClerkLoaded>
          </div>
        </div>

        {/* Bottom Row: Search Bar (Full width on mobile, absolute top on desktop if you prefer) */}
        <form 
          action="/search" 
          method="GET" 
          className="w-full sm:max-w-2xl sm:mx-auto"
          onFocus={() => setIsSearching(true)}
          onBlur={() => setIsSearching(false)}
        >
          <div className={`relative transition-all duration-500 ${isSearching ? 'scale-[1.01]' : ''}`}>
            <input 
              name="query" 
              type="text" 
              placeholder="Search our collection..." 
              className="w-full bg-[#FDFCFA] border border-[#D4AF37]/5 px-6 sm:px-8 py-2 sm:py-3 rounded-none text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#D4AF37]/30 transition-all duration-500 tracking-wide italic text-xs sm:text-sm" 
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#D4AF37]/40 hover:text-[#D4AF37] transition-colors">
              <SearchIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </form>
      </div>
    </header>
  );
}

export default Header