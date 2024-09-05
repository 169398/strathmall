import { Card, CardContent } from '@/components/ui/card'
import { DollarSign, Headset, ShoppingBag, WalletCards } from 'lucide-react'

const EcommerceFeatures = () => {
  return (
    <div className=" ">
      <span className='text-2xl font-bold text-gray-700'>Why StrathMall</span>

      <Card>
        <CardContent className="grid h-56 gap-4 md:grid-cols-4 p-4 bg-gray-50">
          <div className="space-y-2">
            <ShoppingBag />
            <div className="text-sm font-bold text-blue-600">Faster Shipping</div>
            <div className="text-sm text-muted-foreground">
              Shipping within 24 hours
            </div>
          </div>
          <div className="space-y-2">
            <DollarSign />
            <div className="text-sm font-bold text-blue-600">Safe Transactions</div>
            <div className="text-sm text-muted-foreground">
              Secure payment gateway
            </div>
          </div>

          <div className="space-y-2">
            <WalletCards />
            <div className="text-sm font-bold text-blue-600">Flexible Payment</div>
            <div className="text-sm text-muted-foreground">
              Pay with multiple credit cards
            </div>
          </div>

          <div className="space-y-2">
            <Headset />
            <div className="text-sm font-bold text-blue-600">247 Support</div>
            <div className="text-sm text-muted-foreground">
              support customers
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EcommerceFeatures
