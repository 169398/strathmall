import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProductImages from "@/components/shared/product/product-images";
import ProductPrice from "@/components/shared/product/product-price";
import { Card, CardContent } from "@/components/ui/card";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/actions/sellerproduct.actions";
import { APP_NAME } from "@/lib/constants";
import { round2 } from "@/lib/utils";
import Rating from "@/components/shared/product/rating";
import OrderForm from "@/components/shared/bakery/OrderForm";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return { title: "Cake not found" };
  }
  return {
    title: `${product.name} - ${APP_NAME}`,
    description: product.description,
  };
}

const CakeDetails = async ({
  params: { slug },
}: {
  params: { slug: string };
}) => {
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // Fetch related products
  const relatedProducts = await getRelatedProducts(
    product.category,
    product.id
  );
  // Calculate discounted price if applicable
  const discountedPrice =
    product.discount && Number(product.discount) > 0
      ? round2(Number(product.price) * (1 - Number(product.discount) / 100))
      : null;

  return (
    <>
      <section className="container mx-auto px-4 py-8">
        {/* Top Section: Image & Order Form */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Cake Image */}
          <div className="lg:w-1/3  rounded-sm" >
            <ProductImages images={product.images!} />
          </div>

          {/* Right Column: Order Form */}
          <div className="lg:w-2/3">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="text-lg font-semibold">Price</div>
                  <div className="mt-1">
                    {discountedPrice ? (
                      <>
                        <ProductPrice value={discountedPrice} />
                        <ProductPrice
                          value={Number(product.price)}
                          className="line-through text-red-500 ml-2"
                        />
                      </>
                    ) : (
                      <ProductPrice value={Number(product.price)} />
                    )}
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-lg font-semibold">Status</div>
                  {product.stock > 0 ? (
                    <p className="text-green-600">Available</p>
                  ) : (
                    <p className="text-red-600">Unavailable</p>
                  )}
                </div>
                {product.stock !== 0 && (
                  <OrderForm
                    productId={product.id}
                    sellerId={product.sellerId}
                    cakeName={product.name}
                    cakeImage={product.images[0]}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Section: Cake Details */}
        <div className="mt-8">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <Rating
            value={Number(product.rating)}
            caption={`${product.numReviews} reviews`}
          />
          <div className="mt-4">
            <div className="flex items-center gap-3">
              {discountedPrice ? (
                <>
                  <ProductPrice
                    value={discountedPrice}
                    className="text-green-700 font-bold text-2xl"
                  />
                  <ProductPrice
                    value={Number(product.price)}
                    className="text-red-500 line-through"
                  />
                </>
              ) : (
                <ProductPrice
                  value={Number(product.price)}
                  className="text-green-700 font-bold text-2xl"
                />
              )}
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Description:</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      {Array.isArray(relatedProducts) && relatedProducts.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <h2 className="mb-6 text-2xl font-bold">Related Products</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {relatedProducts.map((relatedProduct) => {
              const relatedDiscountedPrice =
                relatedProduct.discount && Number(relatedProduct.discount) > 0
                  ? round2(
                      Number(relatedProduct.price) *
                        (1 - Number(relatedProduct.discount) / 100)
                    )
                  : null;
              return (
                <li key={relatedProduct.id} className="flex flex-col">
                  <Link
                    className="relative h-48 w-full"
                    href={`/product/${relatedProduct.slug}`}
                  >
                    <Image
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.name}
                      className="h-full w-full object-cover rounded-sm"
                      fill
                      sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                    />
                    <div className="absolute bottom-0 left-0 p-2 bg-black bg-opacity-50 text-white w-full">
                      <p className="text-sm font-semibold truncate">
                        {relatedProduct.name}
                      </p>
                      {relatedDiscountedPrice ? (
                        <>
                          <p className="text-sm">
                            Ksh {relatedDiscountedPrice}
                          </p>
                          <p className="text-sm line-through text-red-500">
                            Ksh {round2(relatedProduct.price)}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm">
                          Ksh {round2(relatedProduct.price)}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </>
  );
};

export default CakeDetails;
