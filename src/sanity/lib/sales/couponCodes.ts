export const COUPON_CODES = {
  BUIKECH1: "BUIKECH1",
  XMAS2021: "XMAS2021",
  NY2022: "NY2022",
} as const;

export type CouponCode = keyof typeof COUPON_CODES;