import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";
import { ACTIVE_SALE_BY_COUPON_QUERY_RESULT } from "../../../../sanity.types";

export const getActiveSaleByCouponCode = async (couponCode: string) => {
  const ACTIVE_SALE_BY_COUPON_QUERY = defineQuery(`
    *[_type == "sale" 
    && isActive == true
     && couponCode == $couponCode
     ] | order(validFrom desc)[0] 
    `);

    try {
      const activeSale = await sanityFetch<ACTIVE_SALE_BY_COUPON_QUERY_RESULT>({
        query: ACTIVE_SALE_BY_COUPON_QUERY,
        params: {
          couponCode,
        },
      });
      return activeSale ? activeSale.data : null;
    } catch (error) {
      console.error("Error fetching active sale by coupon code:", error);
      return null;
    }
    
};