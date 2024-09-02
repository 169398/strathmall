import {
  getAllProducts,
  getLatestProducts,
  getDiscountedProducts,
} from "@/lib/actions/sellerproduct.actions";
import HomeLoader from "@/components/shared/loader/HomeLoader";

export default async function Home() {
  const latestProducts = await getLatestProducts();
  const allProducts = await getAllProducts();
  const discountedProducts = await getDiscountedProducts(); 
  return (
    <div>

      <HomeLoader
        latestProducts={latestProducts}
        allProducts={allProducts}
        discountedProducts={discountedProducts}
      />
    </div>
  );
}
