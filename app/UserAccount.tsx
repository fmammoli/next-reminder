import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BadgeHelp, X } from "lucide-react";
import GoogleSignInButton from "./GoogleSignInButton";
import LogoutButton from "./LogoutButton";
import { ReactNode } from "react";

export default function UserAccount({
  setSelectedId,
  name = "Anonymous User :)",
  email = "anon@anonymous.com",
  image,
  anonColors,
  isAnon,
  userId = "",
  boringAvatar,
  isLogged = false,
}: {
  setSelectedId: React.Dispatch<
    React.SetStateAction<"initial" | "default" | "large" | "long" | "loading">
  >;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  anonColors?: string[];
  isAnon?: boolean;
  userId?: string;
  boringAvatar?: ReactNode;
  isLogged?: boolean;
}) {
  function handleClick() {
    setSelectedId("default");
  }

  return (
    <div className="flex flex-col p-1">
      <div className="flex items-center justify-between ">
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Avatar className="w-[60px] h-[60px] rounded-[22px] aspect-square">
              {image && <AvatarImage src={image} />}

              <AvatarFallback className="text-sm bg-black rounded-[22px] aspect-square">
                {boringAvatar ? boringAvatar : "AN"}
              </AvatarFallback>
            </Avatar>
            {isAnon && (
              <div className="absolute right-0 -bottom-1 bg-yellow-200 rounded-full">
                <BadgeHelp
                  strokeWidth={2.5}
                  className="black h-6 w-6 rounded-full text-orange-400"
                ></BadgeHelp>
              </div>
            )}
          </div>
          <article className="text-left text-white justify-self-start">
            <>
              <p className="text-sm">{name}</p>
              <p className="text-sm text-muted-foreground">{email}</p>
            </>
          </article>
        </div>

        <Button
          className="self-start text-muted rounded-full"
          variant={"ghost"}
          size={"icon"}
          onClick={handleClick}
        >
          <X></X>
        </Button>
      </div>

      <article className="text-left text-white my-4 grow">
        {isAnon ? (
          <p className="text-sm">Sign in to sync your data in the cloud!</p>
        ) : (
          <>
            <p className="text-sm">Your Account</p>
            <p className="text-sm">Blabla</p>
            <p className="text-sm">blabla</p>
            <p className="text-sm">blabla</p>
          </>
        )}
      </article>

      {isLogged ? (
        <LogoutButton className="mt-4 w-full rounded-2xl focus:ring-2"></LogoutButton>
      ) : (
        <GoogleSignInButton className="mt-4 w-full rounded-2xl bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:bg-blue-600"></GoogleSignInButton>
      )}
    </div>
  );
}
