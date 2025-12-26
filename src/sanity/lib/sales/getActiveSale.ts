import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";
import { ACTIVE_SALE_QUERY_RESULT } from "../../../../sanity.types";

export const getActiveSale = async () => {
  const ACTIVE_SALE_QUERY = defineQuery(`
    *[_type == "sale" && isActive == true] | order(validFrom desc)[0]
  `);

  try {
    const activeSale = await sanityFetch<ACTIVE_SALE_QUERY_RESULT>({
      query: ACTIVE_SALE_QUERY,
    });
    return activeSale ? activeSale.data : null;
  } catch (error) {
    console.error("Error fetching active sale:", error);
    return null;
  }
};
