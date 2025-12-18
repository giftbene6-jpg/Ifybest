import HolidayCarousel from "@/components/HolidayCarousel";
import ProductsView from "@/components/ProductsView";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
import { getActiveSale } from "@/sanity/lib/sales/getActiveSale";
import { getAllActiveSales } from "@/sanity/lib/sales/getAllActiveSales";

export default async function Home() {
  const products = await getAllProducts();
  const categories = await getAllCategories();
  const sale = await getActiveSale();
  const allSales = await getAllActiveSales();

  return (
    <div className="bg-background">
      <HolidayCarousel sales={allSales}/>
      <div className="flex flex-col items-center justify-top min-h-screen px-4 py-16 max-w-7xl mx-auto">
        <ProductsView products={products} categories={categories} sale={sale}/>
      </div>
    </div>
  );
}
