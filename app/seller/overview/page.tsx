import { auth } from '@/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getSellerOrderSummary } from '@/lib/actions/sellerorder.actions'
import { APP_NAME } from '@/lib/constants'
import { formatCurrency, formatDateTime, formatNumber } from '@/lib/utils'
import { BadgeDollarSign, Barcode, CreditCard } from 'lucide-react'
import { Metadata } from 'next'
import Charts from './charts'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Link from 'next/link'

export const metadata: Metadata = {
  title: `Seller Dashboard - ${APP_NAME}`,
}

export default async function DashboardPage() {
  const session = await auth()
  if (session?.user.role !== 'seller')
    throw new Error('Seller permission required')

  const sellerId = session.user.id || ''

  const summary = await getSellerOrderSummary(sellerId)

  return (
    <div className="space-y-4">
      <h1 className="h2-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BadgeDollarSign />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.ordersPrice[0].sum)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <CreditCard />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary.ordersCount[0].count)}
            </div>
          </CardContent>
        </Card>
       

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Barcode />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.productsCount[0].count}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales Chart</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Charts
              data={{
                salesData: summary.salesData,
              }}
            />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>BUYER</TableHead>
                  <TableHead>DATE</TableHead>
                  <TableHead>TOTAL</TableHead>
                  <TableHead>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.latestOrders.map((sellerOrder) => (
                  <TableRow key={sellerOrder.id}>
                    <TableCell>
                      {sellerOrder.user?.name ? sellerOrder.user.name : 'Deleted user'}
                    </TableCell>

                    <TableCell>
                      {formatDateTime(sellerOrder.createdAt).dateOnly}
                    </TableCell>
                    <TableCell>{formatCurrency(sellerOrder.totalPrice)}</TableCell>

                    <TableCell>
                      <Link href={`/sellerOrder/${sellerOrder.id}`}>
                        <span className="px-2">Details</span>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}