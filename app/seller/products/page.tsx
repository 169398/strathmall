import { auth } from '@/auth'
import DeleteDialog from '@/components/shared/delete-dialog'
import Pagination from '@/components/shared/pagination'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { deleteSellerProduct, getAllSellerProducts } from '@/lib/actions/sellerproduct.actions'
import { APP_NAME } from '@/lib/constants'
import { formatCurrency, formatId } from '@/lib/utils'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: `Seller Products - ${APP_NAME}`,
}

export default async function AdminProductsPage({



  searchParams,
}: {
  searchParams: {
    page: string
    query: string
    category: string
  }
}) {
  const page = Number(searchParams.page) || 1
  const searchText = searchParams.query || ''
  const category = searchParams.category || ''

  const session = await auth();
  const userId = session?.user.id || "";
  const products = await getAllSellerProducts({
    query: searchText,
    category,
    page,
    userId:userId,

  })
  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Products</h1>
        <Button asChild variant="default">
          <Link href="/seller/products/create">Create Product</Link>
        </Button>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead className="text-right">PRICE</TableHead>
              <TableHead>CATEGORY</TableHead>
              <TableHead>STOCK</TableHead>
              <TableHead>RATING</TableHead>
              <TableHead className="w-[100px]">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.data.map((sellerProduct) => (
              <TableRow key={sellerProduct.id}>
                <TableCell>{formatId(sellerProduct.id)}</TableCell>
                <TableCell>{sellerProduct.name}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(sellerProduct.price)}
                </TableCell>
                <TableCell>{sellerProduct.category}</TableCell>
                <TableCell>{sellerProduct.stock}</TableCell>
                <TableCell>{sellerProduct.rating}</TableCell>
                <TableCell className="flex gap-1">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/seller/sellerProducts/${sellerProduct.id}`}>Edit</Link>
                  </Button>
                  
                  <DeleteDialog id={sellerProduct.id} action={ deleteSellerProduct} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {products?.totalPages! > 1 && (
          <Pagination page={page} totalPages={products?.totalPages!} />
        )}
      </div>
    </div>
  )
}
