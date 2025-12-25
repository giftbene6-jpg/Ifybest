"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Sale } from "./types";

const slides = [
  {
    id: 1,
    bg: "bg-gradient-to-r from-violet-600 to-indigo-600",
    title: "EPIC DEALS",
    subtitle: "Upgrade Your Style",
    accent: "text-yellow-400",
  },
  {
    id: 2,
    bg: "bg-gradient-to-r from-pink-500 to-rose-500",
    title: "FLASH SALE",
    subtitle: "Limited Time Only",
    accent: "text-white",
  },
  {
    id: 3,
    bg: "bg-gradient-to-r from-amber-500 to-orange-600",
    title: "CLEARANCE",
    subtitle: "Everything Must Go",
    accent: "text-black",
  },
];

export default function BannerCarousel({ sale }: { sale: Sale }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <div className="relative overflow-hidden w-full mx-auto mt-6 rounded-3xl shadow-2xl h-[450px] md:h-[350px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className={`absolute inset-0 w-full h-full ${slide.bg} flex items-center justify-center`}
        >
            {/* Background Decor */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

          <div className="container mx-auto px-10 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10 w-full">
            {/* Left Content */}
            <div className="flex-1 text-center md:text-left text-white">
              <motion.h4 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ delay: 0.2 }}
                className="text-lg font-bold tracking-widest uppercase mb-2 opacity-80"
              >
                {slide.subtitle}
              </motion.h4>
              <motion.h2 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ delay: 0.4 }}
                className="text-5xl md:text-7xl font-black mb-4 leading-tight shadow-black drop-shadow-lg"
              >
                {slide.title}
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ delay: 0.6 }}
                className="text-xl md:text-2xl font-medium max-w-lg mx-auto md:mx-0"
              >
                 Get <span className={slide.accent + " font-black text-3xl"}>{sale.discountAmount ?? 0}% OFF</span> Everything!
              </motion.p>
            </div>

            {/* Right Card */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
            >
                <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">My Coupon Code</div>
                <div className="text-4xl font-black text-gray-900 tracking-tight border-2 border-dashed border-gray-300 p-2 rounded-lg text-center bg-gray-50">
                    {sale.couponCode}
                </div>
                <p className="text-center text-xs text-gray-400 mt-2">Valid until stocks last</p>
                <div className="mt-4 text-center">
                    <button className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-black transition-colors shadow-lg text-sm w-full">
                        Shop Now
                    </button>
                </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
            <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === current ? "bg-white w-8" : "bg-white/50 hover:bg-white/80"}`}
            />
        ))}
      </div>
    </div>
  );
}
