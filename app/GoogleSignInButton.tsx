import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function GoogleSignInButtom() {
  async function handleClick() {
    signIn("google");
  }
  return (
    <div className="my-8">
      <Button onClick={handleClick}>Sign in with Google</Button>
    </div>
  );
}
