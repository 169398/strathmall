import { Card, CardContent } from '@/components/ui/card'
import { Headset, Shield, ShoppingBag, Users} from 'lucide-react'

const EcommerceFeatures = () => {
  return (
    <div className=" ">
      <span className="text-2xl font-bold text-gray-700">Why StrathMall</span>

      <Card>
        <CardContent className="grid h-56 gap-4 md:grid-cols-4 p-4 bg-gray-50">
          <div className="space-y-2">
            <Shield />
            <div className="text-sm font-bold text-blue-600">
              Verified Products
            </div>
            <div className="text-sm text-muted-foreground">
              Verified products from trusted vendors
            </div>
          </div>
          <div className="space-y-2">
            <ShoppingBag />
            <div className="text-sm font-bold text-blue-600">
              Trusted Vendors
            </div>
            <div className="text-sm text-muted-foreground">
              Verified vendors with quality products
            </div>
          </div>

          <div className="space-y-2">
            <Headset />
            <div className="text-sm font-bold text-blue-600">
              Customer Support
            </div>
            <div className="text-sm text-muted-foreground">
              Support customers with quality products
            </div>
          </div>

          <div className="space-y-2">
            <Users />
            <div className="text-sm font-bold text-blue-600"> Larger Market</div>
            <div className="text-sm text-muted-foreground">
              Reach a larger market
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EcommerceFeatures
