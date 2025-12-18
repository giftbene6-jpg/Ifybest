import Link from "next/link";
import { Product } from "../../sanity.types";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";
import React from "react";
import AddToBasketButton from "./AddToBasketButton";

function ProductThumb ({product, sale}: {product: Product, sale?: any}) {
  const isOutOfStock = product.stock != null && product.stock <= 0;
  
  const discountAmount = sale?.isActive ? sale.discountAmount : 0;
  const price = product.price ?? 0;
  const discountedPrice = discountAmount > 0 ? price * (1 - discountAmount / 100) : price;

  return (
    <Link href={`/product/${product.slug?.current}`}
      className={`group flex flex-col bg-white border border-gray-100 rounded-3xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 overflow-hidden relative
      ${isOutOfStock ? "opacity-60 grayscale" : ""}`}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50/50">
        {product.image && (
          <Image 
            className="object-cover transition-transform duration-700 ease-out scale-100 group-hover:scale-110"
            src={imageUrl(product.image).url()}
            alt={product.name || "Product image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
        
        {/* Discount Badge */}
        {discountAmount > 0 && !isOutOfStock && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 text-[10px] font-black rounded-xl shadow-lg z-10">
            -{discountAmount}% OFF
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm">
            <span className="bg-gray-950 text-white font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded-xl">Sold Out</span>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h2 className="text-base font-bold text-gray-900 line-clamp-1 mb-2 group-hover:text-purple-600 transition-colors duration-300">{product.name}</h2>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
          <div className="flex flex-col">
            {discountAmount > 0 && (
              <span className="text-[10px] text-gray-400 line-through mb-0.5">
                ₦{price.toLocaleString("en-NG")}
              </span>
            )}
            <p className="text-xl font-black premium-gradient-text tracking-tighter">
              ₦{discountedPrice.toLocaleString("en-NG")}
            </p>
          </div>
          
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-purple-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">
            <span className="text-lg font-light">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductThumb;
