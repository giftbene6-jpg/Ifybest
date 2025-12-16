"use server";

import { getActiveSaleByCouponCode } from "@/sanity/lib/sales/getActiveSaleByCouponCode";

export async function validateCoupon(code: string) {
  try {
    const sale = await getActiveSaleByCouponCode(code);
    if (sale && sale.isActive) {
      return {
        isValid: true,
        discountAmount: sale.discountAmount,
        couponCode: sale.couponCode,
      };
    }
    return { isValid: false, message: "Invalid or inactive coupon code" };
  } catch (error) {
    console.error("Error validating coupon:", error);
    return { isValid: false, message: "Error validating coupon" };
  }
}
