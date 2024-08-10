import { Card, CardContent } from '@/components/ui/card'
import { DollarSign, Headset, ShoppingBag, WalletCards } from 'lucide-react'

const EcommerceFeatures = () => {
  return (
    <div className=" ">
      <Card>
        <CardContent className="grid gap-4 md:grid-cols-4 p-4 bg-gray-50">
          <div className="space-y-2">
            <ShoppingBag />
            <div className="text-sm font-bold">Faster Shipping</div>
            <div className="text-sm text-muted-foreground">
              Shipping within 24 hours
            </div>
          </div>
          <div className="space-y-2">
            <DollarSign />
            <div className="text-sm font-bold">Safe Transactions</div>
            <div className="text-sm text-muted-foreground">
              Secure payment gateway
            </div>
          </div>

          <div className="space-y-2">
            <WalletCards />
            <div className="text-sm font-bold">Flexible Payment</div>
            <div className="text-sm text-muted-foreground">
              Pay with multiple credit cards
            </div>
          </div>

          <div className="space-y-2">
            <Headset />
            <div className="text-sm font-bold">247 Support</div>
            <div className="text-sm text-muted-foreground">
              support customers
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default EcommerceFeatures
