import ProductCard from './product-card'
import { product } from '@/types/sellerindex';

const ProductList = ({ title, data }: { title: string; data: product[] }) => {
  return (
    <>
      <h2 className="h2-bold">{title}</h2>

      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.map((product: product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div>
          <p>No product found</p>
        </div>
      )}
    </>
  )
}

export default ProductList
