
import {  Category, Product } from "../../sanity.types";
import ProductGrid from "./ProductGrid";
import { CategorySelectorComponent } from "./category-selector";
interface ProductsViewProps {
  products: Product[];
  categories: Category[];
  sale?: any;
}

const ProductsView = ({ products, categories, sale }: ProductsViewProps) => {
  return (
  <div className="flex flex-col">
    {/*categories */}
    <div className="flex flex-col md:flex-row items-center justify-end w-full mb-12 gap-8">
      <CategorySelectorComponent categories={categories as any} />
    </div>

    {/*products */}
    <div className="flex-1">
      <div>
        <ProductGrid products={products} sale={sale}/>
      </div>
      <hr className="w-1/2 sm:w-3/4"/>
    </div>
  </div>
  );
};

export default ProductsView;