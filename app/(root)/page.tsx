import {
  getAllProducts,
  getLatestProducts,
  getDiscountedProducts,
  getAllServices,
} from "@/lib/actions/sellerproduct.actions";
import HomeLoader from "@/components/shared/loader/HomeLoader";

export default async function Home() {
  const latestProducts = await getLatestProducts();
  const allProducts = await getAllProducts();
  const discountedProducts = await getDiscountedProducts(); 
  const servicesData = await getAllServices();
  return (
    <div>

      <HomeLoader
        latestProducts={latestProducts}
        allProducts={allProducts}
        discountedProducts={discountedProducts}
        servicesData={servicesData}
        Ads={[]}
      />
      
    </div>
  );
}
