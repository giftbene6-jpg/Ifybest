import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";
import { ALL_CATEGORIES_QUERYResult } from "../../../../sanity.types";

export const getAllCategories = async () => {
  const ALL_CATEGORIES_QUERY = defineQuery(`
    *[_type == "category"] | order(title asc) {
      ...,
      "productCount": count(*[_type == "product" && references(^._id)]),
      "productsPreview": *[_type == "product" && references(^._id)] | order(name asc)[0..5]{
        ...,
        "slug": slug.current
      }
    }
    `);
    try{
//use sanityFetch to send the query//
const categories = await sanityFetch<ALL_CATEGORIES_QUERYResult>({
  query: ALL_CATEGORIES_QUERY,
})
//Return the list of products , or an empty array if none are found//
return categories.data || [];
    } catch(error) {
      console.error("Error fetching all products: ",error);
      return [];
    }
    
  
        
    
}