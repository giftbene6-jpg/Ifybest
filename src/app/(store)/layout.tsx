import type { Metadata } from "next";
/*import localFont from "next/font/local";*/
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SanityLive } from "@/sanity/lib/live";
import { CartProvider } from "@/context/CartProvider";

export const metadata: Metadata = {
  title: "IFYBEST - Premium Classic Store",
  description: "Vibrant and simple e-commerce experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider dynamic>
          <CartProvider>
            <main>
              <Header/>
              {children}
            </main>
            <SanityLive />
            <Footer />
          </CartProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
