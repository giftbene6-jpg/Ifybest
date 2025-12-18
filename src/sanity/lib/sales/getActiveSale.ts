import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getActiveSale = async () => {
  const ACTIVE_SALE_QUERY = defineQuery(`
    *[_type == "sale" && isActive == true] | order(validFrom desc)[0]
  `);

  try {
    const activeSale = await sanityFetch({
      query: ACTIVE_SALE_QUERY,
    });
    return activeSale ? activeSale.data : null;
  } catch (error) {
    console.error("Error fetching active sale:", error);
    return null;
  }
};
