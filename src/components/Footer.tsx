"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

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

  const socialLinks = [
    { name: 'Twitter', Icon: Twitter, href: '#' },
    { name: 'Instagram', Icon: Instagram, href: '#' },
    { name: 'Facebook', Icon: Facebook, href: 'https://facebook.com' },
    { name: 'LinkedIn', Icon: Linkedin, href: '#' },
  ];

  return (
    <footer className="bg-gray-950 text-gray-300 border-t border-gray-800 pt-12 sm:pt-20 pb-8 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-12 sm:mb-20">
        {/* Brand & Mission */}
        <div className="space-y-6">
          <Link href="/" className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text hover:opacity-80 transition-opacity">
            IFYBEST
          </Link>
          <p className="text-gray-400 leading-relaxed max-w-xs text-xs sm:text-sm">
            Experience the perfect blend of classic elegance and vibrant modern style. Simple shopping, premium living.
          </p>
          <div className="flex items-center space-x-3 sm:space-x-4">
            {socialLinks.map(({ name, Icon, href }) => (
              <a 
                key={name} 
                href={href} 
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-900/50 border border-gray-800 flex items-center justify-center text-gray-400 hover:border-purple-500 hover:text-purple-400 hover:scale-110 transition-all duration-300"
              >
                <span className="sr-only">{name}</span>
                <Icon size={18} className="sm:w-5 sm:h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div className="hidden sm:block">
          <h4 className="text-white font-bold mb-4 sm:mb-6 tracking-wide uppercase text-[10px] sm:text-xs">Shop</h4>
          <ul className="space-y-3 sm:space-y-4">
            {['All Products', 'New Arrivals', 'Best Sellers', 'On Sale'].map((item) => (
              <li key={item}>
                <Link href="/search" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div className="hidden sm:block">
          <h4 className="text-white font-bold mb-4 sm:mb-6 tracking-wide uppercase text-[10px] sm:text-xs">Help</h4>
          <ul className="space-y-3 sm:space-y-4">
            {['Shipping', 'Returns', 'Size Guide', 'FAQ'].map((item) => (
              <li key={item}>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="sm:col-span-1">
          <h4 className="text-white font-bold mb-4 sm:mb-6 tracking-wide uppercase text-[10px] sm:text-xs">Stay Inspired</h4>
          
          {status === "success" ? (
            <div className="bg-gray-900/50 border border-green-500/30 p-4 sm:p-6 rounded-2xl animate-in fade-in zoom-in duration-300">
              <div className="text-green-400 text-2xl sm:text-3xl mb-2">✓</div>
              <h5 className="text-white font-bold mb-1 text-sm">Subscribed!</h5>
              <p className="text-gray-400 text-[10px] sm:text-xs text-wrap break-words">Welcome to IFYBEST.</p>
            </div>
          ) : (
            <>
              <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">Join our community for exclusive drops and timeless style tips.</p>
              <form onSubmit={handleSubscribe} className="flex flex-col space-y-3">
                <input 
                  type="email" 
                  required
                  placeholder="Your email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-900 border border-gray-800 px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                />
                <button 
                  disabled={status === "loading"}
                  className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm shadow-xl shadow-purple-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 border-t border-gray-900 flex flex-col items-center sm:items-start space-y-4 sm:space-y-0 text-[10px] sm:text-xs font-medium text-gray-500">
        <div className="flex flex-col sm:flex-row justify-between w-full items-center">
          <p className="mb-4 sm:mb-0 text-center sm:text-left">© 2025 IFYBEST. Created with passion and excellence.</p>
          <div className="flex flex-wrap justify-center sm:justify-end gap-x-6 gap-y-2">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
