"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

import { Sale } from "../../sanity.types";

interface HolidayCarouselProps {
  sales: Sale[];
}

const HolidayCarousel = ({ sales }: HolidayCarouselProps) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (sales.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sales.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sales.length]);

  if (sales.length === 0) return null;

  return (
    <div className="relative w-full px-4 mt-6 h-[400px] md:h-[500px]">
      <div className="relative w-full h-full overflow-hidden rounded-3xl shadow-2xl">
        {sales.map((sale, index) => (
          <div
            key={sale._id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
              index === current ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
            }`}
          >
            {/* Festive Backgrounds based on index or title */}
            <div className={`absolute inset-0 bg-gradient-to-br ${
              index % 2 === 0 
                ? "from-red-600 via-green-600 to-emerald-800" // Christmas Theme
                : "from-blue-900 via-purple-900 to-indigo-950" // New Year Theme
            }`}>
              {/* Decorative elements (using CSS/Divs since I don't have SVGs handy) */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full -ml-44 -mb-44 blur-[100px]"></div>
              
              {/* Animated "Snow" or "Fireworks" - Simple CSS dots */}
              <div className="Snowflakes absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute bg-white/40 rounded-full animate-pulse"
                    style={{
                      width: Math.random() * 4 + 2 + "px",
                      height: Math.random() * 4 + 2 + "px",
                      top: Math.random() * 100 + "%",
                      left: Math.random() * 100 + "%",
                      animationDelay: Math.random() * 5 + "s",
                      animationDuration: Math.random() * 3 + 2 + "s"
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="relative h-full flex flex-col items-center justify-center text-center px-6 py-12 text-white z-10">
              <div className="animate-bounce mb-4 text-4xl">
                {index % 2 === 0 ? "🎄" : "🎆"}
              </div>
              <h4 className="text-sm font-black uppercase tracking-[0.3em] mb-4 bg-white/20 px-4 py-1 rounded-full backdrop-blur-sm">
                Holiday Special
              </h4>
              <h2 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter leading-tight">
                {sale.title?.toUpperCase() || "HOLIDAY SALE"}
              </h2>
              <p className="text-lg md:text-xl font-medium opacity-90 max-w-2xl mb-10 leading-relaxed">
                {sale.description}
              </p>

              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="bg-white/95 text-gray-900 px-8 py-4 rounded-2xl shadow-2xl flex flex-col items-center transform hover:scale-105 transition-transform">
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Coupon Code</span>
                   <span className="text-3xl font-black text-red-600 tracking-tighter">{sale.couponCode}</span>
                </div>
                
                <div className="text-3xl font-black bg-yellow-400 text-gray-900 px-6 py-4 rounded-2xl rotate-3 shadow-lg">
                  {sale.discountAmount}% OFF!
                </div>
              </div>

              <Link href="/search">
                <button className="mt-12 bg-white text-gray-900 px-12 py-4 rounded-full font-black text-lg hover:bg-black hover:text-white transition-all shadow-xl active:scale-95">
                  SHOP THE COLLECTION
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Dots navigation */}
      {sales.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
          {sales.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-white" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HolidayCarousel;
