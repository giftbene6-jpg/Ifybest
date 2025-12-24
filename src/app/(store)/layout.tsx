import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SanityLive } from "@/sanity/lib/live";
import { CartProvider } from "@/context/CartProvider";

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <main>
        <Header />
        {children}
      </main>
      <SanityLive />
      <Footer />
    </CartProvider>
  );
}
