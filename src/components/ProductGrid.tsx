"use client";

import { Product } from "../../sanity.types";
import ProductThumb from "./ProductThumb";
import { Sale } from "./types";

function ProductGrid ({products, sale}: {products: Product[], sale?: Sale | null}) {
return (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16 mt-12 w-full">
  {products?.map((product) => {
    return <ProductThumb key={product._id} product={product} sale={sale}/>;
  })}
</div>
);

};

export default ProductGrid;