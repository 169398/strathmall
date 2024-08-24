// pages/index.tsx
import { getAllProducts, getLatestProducts } from '@/lib/actions/sellerproduct.actions';
import HomeLoader from '@/components/shared/loader/HomeLoader';

export default async function Home() {
  const latestProducts = await getLatestProducts();
  const allProducts = await getAllProducts();

  return <HomeLoader latestProducts={latestProducts} allProducts={allProducts} />;
}
