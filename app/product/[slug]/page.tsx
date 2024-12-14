import { notFound } from "next/navigation";
import { getProductBySlug, getSellerProducts } from "@/lib/actions/product.actions";
import { getSellerById } from "@/lib/actions/seller.actions";
import { WhatsApp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ProductCard } from "@/components/shared/product-card";
import Rating from "@/components/shared/product/rating";
import { round2 } from "@/lib/utils";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)
  if (!product) notFound()
  
  const seller = await getSellerById(product.sellerId)
  const relatedProducts = await getSellerProducts(product.sellerId, params.slug)

  // Calculate discounted price if there's a discount
  const discountedPrice = product.discount && Number(product.discount) > 0
    ? round2(Number(product.price) * (1 - Number(product.discount) / 100))
    : null;

  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in your product "${product.name}" (${discountedPrice || product.price} KSH) on StrathMall. Is it available?`
  )
  const whatsappLink = `https://wa.me/${seller.phoneNumber}?text=${whatsappMessage}`

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative aspect-square rounded-xl overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="bg-blue-50">
                  {product.category}
                </Badge>
                {product.brand && (
                  <Badge variant="outline" className="bg-purple-50">
                    {product.brand}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <div className="mt-2">
                <Rating
                  value={Number(product.rating)}
                  caption={`${product.numReviews} reviews`}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {discountedPrice ? (
                <>
                  <p className="text-3xl font-bold text-green-600">
                    Ksh {discountedPrice}
                  </p>
                  <p className="text-xl text-gray-500 line-through">
                    Ksh {product.price}
                  </p>
                  <Badge variant="destructive" className="ml-2">
                    {product.discount}% OFF
                  </Badge>
                </>
              ) : (
                <p className="text-3xl font-bold text-green-600">
                  Ksh {product.price}
                </p>
              )}
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Seller Information</h3>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Shop:</span>
                  <span className="text-gray-600">{seller.shopName}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Location:</span>
                  <span className="text-gray-600">{seller.location}</span>
                </p>
                {product.stock > 0 ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
              <a 
                href={whatsappLink}
                target="_blank" 
                rel="noopener noreferrer"
                className="block mt-4"
              >
                <Button className="w-full bg-green-500 hover:bg-green-600 h-12 text-lg">
                  <WhatsApp className="w-5 h-5 mr-2" />
                  Chat with Seller
                </Button>
              </a>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-900">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">More from this seller</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map(product => (
              <ProductCard key={product.id} product={product} seller={seller} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 