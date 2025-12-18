"use client"

import { ClerkLoaded, SignedIn, SignInButton, UserButton, useUser } from "@clerk/nextjs"
import Link from "next/link";
import { useCart } from "@/context/CartProvider";
import { PackageIcon, TrolleyIcon, SearchIcon } from "@sanity/icons";





function Header() {
/**
TO KNOW IF USER IS LOGGED IN
 */
  const {user} = useUser();
  const { totalItems } = useCart();

/*  const createClerkPasskey = async() => {try{const response = await user?.createPasskey();
  console.log(response);
} catch (err) {console.log("Error:", JSON.stringify(err, null, 2));}};
  /* await user?.createPasskey();};*/


  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 flex flex-wrap justify-between items-center transition-all duration-300">
      {/* Brand Section */}
      <Link 
        href="/"
        className="text-3xl font-black tracking-tighter premium-gradient-text hover:opacity-80 transition-all duration-300 mx-auto sm:mx-0"
      >
        IFYBEST
      </Link>

      {/* Search Bar */}
      <form action="/search" method="GET" className="w-full sm:w-auto sm:flex-1 sm:mx-8 mt-4 sm:mt-0">
        <div className="relative group">
          <input 
            name="query" 
            type="text" 
            placeholder="Search for products..." 
            className="w-full bg-gray-50 border border-gray-200 px-5 py-2.5 rounded-full text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-300" 
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-purple-600 transition-colors">
            <SearchIcon className="w-6 h-6" />
          </button>
        </div>
      </form>

      {/* Navigation & User Area */}
      <div className="flex items-center space-x-6 mt-4 sm:mt-0">
        <Link
          href="/basket"
          className="relative flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-300"
        >
          <div className="relative">
            <TrolleyIcon className="w-7 h-7"/>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-sm font-semibold hidden sm:block">Basket</span>
        </Link>

        {/* user area */}
        <ClerkLoaded>
          <SignedIn>
            <Link href="/orders" className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-300">
              <PackageIcon className="w-7 h-7"/>
              <span className="text-sm font-semibold hidden sm:block">Orders</span>
            </Link>
          </SignedIn>

          {user ? (
            <div className="flex items-center space-x-3 border-l border-gray-100 pl-6">
              <UserButton appearance={{ elements: { userButtonAvatarBox: "w-9 h-9 border-2 border-purple-100" } }} />
            </div>
          ) : (
            <div className="border-l border-gray-100 pl-6">
              <SignInButton mode="modal">
                <button className="classic-button !py-2 !px-6 !text-xs">Sign In</button>
              </SignInButton>
            </div>
          )}
        </ClerkLoaded>
      </div>
    </header>
  );
}

export default Header