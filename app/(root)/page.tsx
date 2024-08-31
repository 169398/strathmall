import {
  getAllProducts,
  getLatestProducts,
  getDiscountedProducts,
} from "@/lib/actions/sellerproduct.actions";
import HomeLoader from "@/components/shared/loader/HomeLoader";
import Navbar from "@/components/shared/Navbar";

export default async function Home() {
  const latestProducts = await getLatestProducts();
  const allProducts = await getAllProducts();
  const discountedProducts = await getDiscountedProducts(); // Fetch discounted products

  return (
    <div>
      <Navbar />

      <HomeLoader
        latestProducts={latestProducts}
        allProducts={allProducts}
        discountedProducts={discountedProducts}
      />
    </div>
  );
}
