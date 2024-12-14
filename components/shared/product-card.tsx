import { WhatsApp } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import Image from 'next/image'
import Link from 'next/link'

export function ProductCard({ product, seller }) {
  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in your product "${product.name}" (${product.price} KSH) on StrathMall. Is it available?`
  )
  const whatsappLink = `https://wa.me/${seller.phoneNumber}?text=${whatsappMessage}`

  return (
    <Card className="group overflow-hidden">
      <CardHeader className="p-0">
        <Link href={`/product/${product.slug}`}>
          <div className="relative aspect-square">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold truncate">{product.name}</h3>
        </Link>
        <p className="text-sm text-gray-500">{seller.shopName}</p>
        <p className="font-bold mt-1">Ksh {product.price}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <a 
          href={whatsappLink}
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button className="w-full bg-green-500 hover:bg-green-600">
            <WhatsApp className="w-4 h-4 mr-2" />
            Contact Seller
          </Button>
        </a>
      </CardFooter>
    </Card>
  )
} 