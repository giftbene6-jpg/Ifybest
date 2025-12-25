import { getProductBySlug } from "@/sanity/lib/products/getProductBySlug";
// import Image from "next/image";
import { notFound } from "next/navigation";

import ProductImageGallery from "@/components/ProductImageGallery";
import AddToBasketButton from "@/components/AddToBasketButton";
import { getActiveSale } from "@/sanity/lib/sales/getActiveSale";

async function Page ({
  params,
}: { 
  params: Promise<{
     slug: string;
    }>;
  }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if(!product) {
    console.log("product: ", product)
    return notFound();
  }
  const isOutOfStock = product.stock != null && product.stock <= 0;
  const sale = await getActiveSale();
  const discountAmount = sale?.isActive ? (sale.discountAmount ?? 0) : 0;
  const price = product.price ?? 0;
  const discountedPrice = discountAmount > 0 ? price * (1 - discountAmount / 100) : price;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProductImageGallery product={product} />
        
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            
            <div className="mb-4">
              {discountAmount > 0 && (
                <span className="text-sm text-gray-400 line-through block">
                   ₦{price.toLocaleString("en-NG")}
                </span>
              )}
              <div className="text-3xl font-black text-purple-600">
                ₦{discountedPrice.toLocaleString("en-NG")}
              </div>
            </div>

            <div className="mb-6">
                <AddToBasketButton product={product} disabled={isOutOfStock} />
            </div>


            
            <div className="mt-6">{product.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page