export interface Sale {
  _id: string;
  discountAmount: number;
  isActive: boolean;
  title?: string;
  couponCode?: string;
  validFrom?: string;
  validUntil?: string;
}
