import { getActiveSaleByCouponCode } from "@/sanity/lib/sales/getActiveSaleByCouponCode";
import BannerCarousel from "./BannerCarousel";

async function BlackFridayBanner () {
  const sale = await getActiveSaleByCouponCode('BUIKECH1');
  if (!sale?.isActive) {
    return null;
  }
  
  return <BannerCarousel sale={sale} />;
}

export default BlackFridayBanner;