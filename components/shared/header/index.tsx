import Link from 'next/link';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { MenuIcon, XIcon } from 'lucide-react'; // Import XIcon
import { getAllCategories } from '@/lib/actions/sellerproduct.actions';

const Header = async () => {
  const categories = await getAllCategories();

  return (
    <header>
      <div className="wrapper flex-between">
        <div className="flex-start">
          <Drawer direction="left">
            <DrawerTrigger asChild>
              <Button variant="outline">
                <MenuIcon />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-full max-w-xs  ">
              <DrawerHeader>
                <div className="flex items-center justify-between">
                  <DrawerTitle>Select a category</DrawerTitle>
                  <DrawerClose asChild>
                    <Button variant="outline" className="p-1">
                      <XIcon className="h-6 w-6" />
                    </Button>
                  </DrawerClose>
                </div>
                <div className="space-y-1 mt-4">
                  {categories.map((category: { name: string }) => (
                    <Button
                      className="w-full justify-start"
                      variant="ghost"
                      key={category.name}
                      asChild
                    >
                      <DrawerClose asChild>
                        <Link href={`/search?category=${category.name}`}>
                          {category.name}
                        </Link>
                      </DrawerClose>
                    </Button>
                  ))}
                </div>
              </DrawerHeader>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}

export default Header;
