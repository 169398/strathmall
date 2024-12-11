import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOut } from '@/lib/actions/user.actions'
import { UserAvatar } from '../UserAvatar'
import { auth } from '@/auth'


export default async function UserButton() {
  const session = await auth()
  if (!session)
    return (
      <Link href="/api/auth/signin">
        <Button aria-label='login'>Log in</Button>
      </Link>
    )
  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <UserAvatar
            user={{
              name: session?.user.name || null,
              image:
                session?.user.image ?? "https://avatar.vercel.sh/${user.name}",
            }}
            className="h-8 w-8 cursor-pointer"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem>
            <Link className="w-full" href="/user/profile">
              Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link className="w-full" href="/user/orders">
              Order History
            </Link>
          </DropdownMenuItem>

          {session.user.role === "seller" && (
            <DropdownMenuItem>
              <Link className="w-full" href="/seller/overview">
                My Shop
              </Link>
            </DropdownMenuItem>
          )}
          {session.user.role === "delivery" && (
            <DropdownMenuItem>
              <Link className="w-full" href="/delivery/overview">
                My Deliveries
              </Link>
            </DropdownMenuItem>
          )}

        
          {session.user.role === "admin" && (
            <DropdownMenuItem>
              <Link className="w-full" href="/admin/overview">
                Admin
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className="p-0 mb-1">
            <form action={SignOut} className="w-full">
              <Button
                className="w-full py-4 px-2 h-4 justify-start"
                variant="ghost"
                aria-label='logout'
              >
                Log out
              </Button>
            </form>
          </DropdownMenuItem>
          {/* <ModeToggle /> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
