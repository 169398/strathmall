import { getMyCart } from '@/lib/actions/sellercart.actions';
import CartForm from './cart-form';
import { APP_NAME } from '@/lib/constants';

export const metadata = {
  title: `Shopping Cart - ${APP_NAME}`,
};

export default async function CartPage() {
  const sellerCart = await getMyCart();

  return <CartForm cart={sellerCart} />;
}
