"use client";

import React, { useState } from "react";
import Link from "next/link";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <footer className="bg-gray-950 text-gray-300 border-t border-gray-800 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        {/* Brand & Mission */}
        <div className="space-y-6">
          <Link href="/" className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            IFYBEST
          </Link>
          <p className="text-gray-400 leading-relaxed max-w-xs text-sm">
            Experience the perfect blend of classic elegance and vibrant modern style. Simple shopping, premium living.
          </p>
          <div className="flex items-center space-x-4">
            {['Twitter', 'Instagram', 'Facebook', 'LinkedIn'].map((platform) => (
              <a 
                key={platform} 
                href="#" 
                className="w-10 h-10 rounded-full bg-gray-900/50 border border-gray-800 flex items-center justify-center text-gray-400 hover:border-purple-500 hover:text-purple-400 hover:scale-110 transition-all duration-300"
              >
                <span className="sr-only">{platform}</span>
                <div className="w-5 h-5 border-2 border-current rounded-sm"></div>
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-xs">Shop</h4>
          <ul className="space-y-4">
            {['All Products', 'New Arrivals', 'Best Sellers', 'On Sale'].map((item) => (
              <li key={item}>
                <Link href="/search" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-xs">Help</h4>
          <ul className="space-y-4">
            {['Shipping', 'Returns', 'Size Guide', 'FAQ'].map((item) => (
              <li key={item}>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-xs">Stay Inspired</h4>
          
          {status === "success" ? (
            <div className="bg-gray-900/50 border border-green-500/30 p-6 rounded-2xl animate-in fade-in zoom-in duration-300">
              <div className="text-green-400 text-3xl mb-2">✓</div>
              <h5 className="text-white font-bold mb-1">Subscribed!</h5>
              <p className="text-gray-400 text-xs text-wrap break-words">Welcome to IFYBEST.</p>
            </div>
          ) : (
            <>
              <p className="text-gray-400 text-sm mb-6">Join our community for exclusive drops and timeless style tips.</p>
              <form onSubmit={handleSubscribe} className="flex flex-col space-y-3">
                <input 
                  type="email" 
                  required
                  placeholder="Your email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-900 border border-gray-800 px-4 py-3 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                />
                <button 
                  disabled={status === "loading"}
                  className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 rounded-xl text-sm shadow-xl shadow-purple-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {status === "loading" ? "Subscribing..." : "Subscribe"}
                </button>
                {status === "error" && (
                  <p className="text-red-400 text-[10px] font-bold">Oops! Something went wrong. Try again.</p>
                )}
              </form>
            </>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 text-xs font-medium text-gray-500">
        <p>© 2025 IFYBEST. Created with passion and excellence.</p>
        <div className="flex space-x-10">
          <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-white transition-colors">Cookies Settings</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
