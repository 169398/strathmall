import MaxWidthWrapper from '@/components/shared/MaxWidthWrapper'
import EcommerceFeatures from '@/components/shared/product/ecommerce-features'
import ProductList from '@/components/shared/product/product-list'
import ProductPromotion from '@/components/shared/product/product-promotion'
import {

  getSellerLatestProducts,
} from '@/lib/actions/sellerproduct.actions'
import {  buttonVariants } from '@/components/ui/button'
import Link from 'next/link'

export default async function Home() {
  const latestProducts = await getSellerLatestProducts()
  return (
    <div>
      <MaxWidthWrapper>
        <div className="mx-auto flex max-w-3xl flex-col items-center py-20 text-center">
          <h1 className="tranking-tight text-4xl font-bold text-gray-950 sm:text-6xl">
            Welcome to StrathMall: Where Quality Meets
            <span className="text-blue-700">Community</span>.
          </h1>
          <p className="mt-6 max-w-prose text-lg text-muted-foreground">
            Shop with confidence, support local sellers, and contribute to the
            vibrant Strathmore community. Together, we buy better and build
            stronger.
            
          </p>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/seller "
              className={buttonVariants({ variant: "default" })}
            >
              Start selling
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
      <div className="space-y-8">
        <ProductList title="Newest Arrivals" data={latestProducts} />
        <ProductPromotion />
        <EcommerceFeatures />
      </div>
    </div>
  );
}
