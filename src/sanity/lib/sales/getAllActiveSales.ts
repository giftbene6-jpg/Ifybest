import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getAllActiveSales = async () => {
  const ALL_ACTIVE_SALES_QUERY = defineQuery(`
    *[_type == "sale" && isActive == true] | order(validFrom desc)
  `);

  try {
    const sales = await sanityFetch({
      query: ALL_ACTIVE_SALES_QUERY,
    });
    return sales ? sales.data : [];
  } catch (error) {
    console.error("Error fetching all active sales:", error);
    return [];
  }
};
