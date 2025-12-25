import { defineQuery } from "next-sanity"
import { sanityFetch } from "../live";
import { PRODUCT_SEARCH_QUERYResult } from "../../../../sanity.types";

export const searchProductsByName = async (searchParam?: string, category?: string) => {
  const PRODUCT_SEARCH_QUERY = defineQuery(`
    *[_type == "product"
      && ($searchParam == "" || name match $searchParam)
      && ($category == "" || $category in categories[]->slug.current)
    ] | order(name asc)
    `);

  try {
    const sp = searchParam?.trim() ?? "";
    const cat = category?.trim() ?? "";

    const products = await sanityFetch<PRODUCT_SEARCH_QUERYResult>({
      query: PRODUCT_SEARCH_QUERY,
      params: {
        searchParam: sp ? `${sp}*` : "",
        category: cat,
      },
    });

    return products.data || [];
  } catch (error) {
    console.error("Error fetching products by name:", error);
    return [];
  }
};