"use client";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/clientApp";
import { signIn, signOut } from "next-auth/react";

export default function LogoutButton() {
  async function handleClick() {
    await auth.signOut();
    //Hot fix!
    //Some bug is creating this key, should deal with it
    window.localStorage.removeItem("my-reminders-anon-null");
    await signOut();
  }
  return <Button onClick={handleClick}>Log out!</Button>;
}
