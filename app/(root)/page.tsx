import MaxWidthWrapper from '@/components/shared/MaxWidthWrapper'
import EcommerceFeatures from '@/components/shared/product/ecommerce-features'
import ProductPromotion from '@/components/shared/product/product-promotion'
import {

  getLatestProducts,
} from '@/lib/actions/sellerproduct.actions'
import {  buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import * as React from "react"
import ProductList from '@/components/shared/product/home-productlist'
import SparklesText from '@/components/magicui/sparkles-text'
import Footer from '@/components/shared/footer'
 


export default async function Home() {
  const latestProducts = await getLatestProducts()
  return (
   

    <div>

      <MaxWidthWrapper>
        <div className="mx-auto flex max-w-3xl flex-col items-center py-20 text-center">
          <h1 className="tranking-tight text-4xl font-bold text-gray-950 sm:text-6xl">
            Your marketplace where  quality finds {" "}
            <span className="text-blue-700">you</span>.
          </h1>
          <p className="mt-6 max-w-prose text-lg text-muted-foreground">
            Welcome to StrathMall.Every product on this platform is verified by
            our team to ensure our highest quality standards.
{/*             <span className="text-blue-400">
              Buy Strathmore Build Strathmore{" "}
            </span> */}
          </p>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          
              <Link
                href="/seller "
                className={buttonVariants({ variant: "secondary" })}
              >
                <SparklesText   text='🎉Start selling' className='text-base text-blue-500'>
                </SparklesText>
              </Link>
            
          </div>
        </div>
      </MaxWidthWrapper>
      <div className="space-y-8">
       
        <ProductList title="Newest Arrivals" data={latestProducts} />
        
        <ProductPromotion />
        <EcommerceFeatures />
        <Footer />


      </div>
    </div>
  );
}
