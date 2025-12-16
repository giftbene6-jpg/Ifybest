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
  <header 
  className="flex flex-wrap justify-between px-4 py-2">
    {/*top row */}
    <div className="flex w-full flex-wrap justify-between items-center px-4 py-2">
      <Link href="/"
      className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 hover:opacity-80 cursor-pointer mx-auto sm:mx-0 transition-opacity">Ifybest</Link>




      <form action="/search" method="GET" className="w-full sm:w-auto sm:flex-1 sm:mx-4 mt-2 sm:mt-0">
        <div className="relative w-full max-w-4xl">
          <input 
            name="query" 
            type="text" 
            placeholder="search for products" 
            className="bg-gray-100 text-gray-800 px-4 py-2 pr-12 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 border w-full" 
          />
          <button type="submit" className="absolute right-0 top-0 h-full px-4 text-gray-500 hover:text-black hover:bg-yellow-400 transition-colors rounded-r-md">
            <SearchIcon className="w-5 h-5" />
          </button>
        </div>
      </form>




      <div className="flex items-center space-x-4 mt-0 flex-1 sm:flex-none ">
        <Link
          href="/basket"
          className="relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-2 px-4 rounded hover:shadow-lg transition-shadow"
        >
          <TrolleyIcon className="w-6 h-6"/>
          <span>My Basket</span>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{totalItems}</span>
          )}
        </Link>

        {/*user area . Only if the user exists AND HAS AN ACCOUNT ALREADY then we use clerkload and package*/}
        <ClerkLoaded>
          <SignedIn>
            <Link href="/orders" className="flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center
            space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-2 px-4 rounded hover:shadow-lg transition-shadow">
              <PackageIcon className="w-6 h-6"/>
              <span>My Orders</span>
            </Link>
        </SignedIn>

{/*use this when the user does not exist to create an account */}
          {user ? (
            <div className="flex items-center space-x-2">
              <UserButton/>
              <div className="hidden sm:block text-xs">
                <p className="text-gray-400 ">Signed in</p>
               {/* <p className="font-bold">{user.fullName}!</p>*/}
              </div>
            </div>
          ):(
            <SignInButton mode="modal"/>
          )}

          
        </ClerkLoaded>
          </div>
 
    </div>

    
  </header>
  
        )
}

export default Header