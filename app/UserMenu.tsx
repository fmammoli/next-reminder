import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactNode } from "react";

import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

import GoogleSignInButton from "./GoogleSignInButton";
import LogoutButton from "./LogoutButton";

export default async function UserMenu({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>{session?.user.email}</DropdownMenuItem>
          <DropdownMenuItem>
            <GoogleSignInButton></GoogleSignInButton>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogoutButton></LogoutButton>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
