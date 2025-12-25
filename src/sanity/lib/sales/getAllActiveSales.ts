import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";
import { ALL_ACTIVE_SALES_QUERYResult } from "../../../../sanity.types";

export const getAllActiveSales = async () => {
  const ALL_ACTIVE_SALES_QUERY = defineQuery(`
    *[_type == "sale" && isActive == true] | order(validFrom desc)
  `);

  try {
    const sales = await sanityFetch<ALL_ACTIVE_SALES_QUERYResult>({
      query: ALL_ACTIVE_SALES_QUERY,
    });
    return sales ? sales.data : [];
  } catch (error) {
    console.error("Error fetching all active sales:", error);
    return [];
  }
};
