"use client";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/clientApp";
import { LogOut } from "lucide-react";
import { signIn, signOut } from "next-auth/react";

export default function LogoutButton({
  className = "",
}: {
  className?: string;
}) {
  async function handleClick() {
    await auth.signOut();
    //Hot fix!
    //Some bug is creating this key, should deal with it
    window.localStorage.removeItem("my-reminders-anon-null");
    await signOut();
  }
  return (
    <Button className={`flex gap-2 ${className}`} onClick={handleClick}>
      <LogOut></LogOut>
      Log out
    </Button>
  );
}
