

import Link from "next/link";
import { signOut } from "next-auth/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { UserAvatar } from "./UserAvatar";
import { auth } from "@/auth";



export default async function UserAccountNav() {

 const session =  await auth()
 


  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserAvatar
            user={{
              name: session?.user.name || null,
               image : session?.user.image ?? 
                "https://avatar.vercel.sh/${user.name}",
            }}
            className="h-8 w-8"
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-60 bg-white" align="end">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {session?.user.name && <p className="font-medium">{session?.user.name}</p>}
              {session?.user.email && (
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  {session.user.email}
                </p>
              )}
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/user/profile">Profile</Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/user/profile">Order History</Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/user/settings">Settings</Link>
          </DropdownMenuItem>
          {session?.user.role === "admin" && (
            <DropdownMenuItem>
              <Link className="w-full" href="/admin/overview">
                Admin
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={(event) => {
              event.preventDefault();
              void signOut({
                callbackUrl: `${window.location.origin}/`,
              });
            }}
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}



