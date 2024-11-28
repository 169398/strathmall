import { notFound } from "next/navigation";
import ProductImages from "@/components/shared/product/product-images";
import ProductPrice from "@/components/shared/product/product-price";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/actions/sellerproduct.actions";
import { APP_NAME } from "@/lib/constants";
import AddToCart from "@/components/shared/product/add-to-cart";
import { getMyCart } from "@/lib/actions/sellercart.actions";
import { round2 } from "@/lib/utils";
import ReviewList from "./review-list";
import { auth } from "@/auth";
import Rating from "@/components/shared/product/rating";
import Link from "next/link";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: "Product not found" };
  }
  return {
    title: `${product.name} - ${APP_NAME}`,
    description: product.description,
  };
}

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetails({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const cart = await getMyCart();
  const session = await auth();

  // Fetch related products
  const relatedProducts = await getRelatedProducts(
    product.category,
    product.id
  );

  // Calculate discounted price if there's a discount
  const discountedPrice =
      product.discount && Number(product.discount) > 0
        ? round2(Number(product.price) * (1 - Number(product.discount) / 100))
        : null;

  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="col-span-2">
            <ProductImages images={product.images!} />
          </div>

          <div className="col-span-2 flex flex-col w-full gap-8 p-5">
            <div className="flex flex-col gap-6">
              <p className="p-medium-16 rounded-full bg-grey-500/10 text-grey-500">
                {product.brand} {product.category}
              </p>
              <h1 className="h3-bold">{product.name}</h1>
              <Rating
                value={Number(product.rating)}
                caption={`${product.numReviews} reviews`}
              />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-3">
                  {discountedPrice ? (
                    <>
                      <ProductPrice
                        value={discountedPrice}
                        className="p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700"
                      />
                      <ProductPrice
                        value={Number(product.price)}
                        className="p-medium-16 line-through text-red-500"
                      />
                    </>
                  ) : (
                    <ProductPrice
                      value={Number(product.price)}
                      className="p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700"
                    />
                  )}
                </div>
              </div>
            </div>

            <div>
              <p>Description:</p>
              <p>{product.description}</p>
            </div>
          </div>
          <div>
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex justify-between">
                  <div>Price</div>
                  <div>
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
                <div className="mb-2 flex justify-between">
                  <div>Status</div>
                  {product.stock > 0 ? (
                    <Badge variant="outline">In stock</Badge>
                  ) : (
                    <Badge variant="destructive">Unavailable</Badge>
                  )}
                </div>
                {product.stock !== 0 && (
                  <div className="flex-center">
                    <AddToCart
                      cart={cart}
                      item={{
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: discountedPrice ?? round2(product.price),
                        qty: 1,
                        image: product.images![0],
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mt-10">,
        <h2 className="h2-bold mb-5">Customer Reviews</h2>
        <ReviewList
          productId={product.id}
          productSlug={product.slug}
          userId={session?.user.id!}
        />
      </section>

      {Array.isArray(relatedProducts) && relatedProducts.length > 0 && (
        <section className="py-8">
          <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
          <ul className="flex w-full gap-4 overflow-x-auto pt-1">
            {relatedProducts.map((relatedProduct) => {
              const relatedDiscountedPrice =
                relatedProduct.discount && Number(relatedProduct.discount)> 0
                  ? round2(
                      Number(relatedProduct.price) *
                        (1 - Number(relatedProduct.discount) / 100)
                    )
                  : null;
              return (
                <li
                  key={relatedProduct.id}
                  className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
                >
                  <Link
                    className="relative h-full w-full"
                    href={`/product/${relatedProduct.slug}`}
                  >
                    <div className="relative h-full w-full">
                      <Image
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        className="h-full w-full object-cover rounded-lg"
                        fill
                        sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                      />
                      <div className="absolute bottom-0 left-0 p-2 bg-black bg-opacity-50 text-white">
                        <p className="text-sm font-semibold">
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
}
