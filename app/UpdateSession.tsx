"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function UpdateSection() {
  const { data: session, update } = useSession();
  return (
    <Button
      onClick={(e) => {
        update({ studd: "aaa" }).then((r) => {
          console.log("updated");
        });
      }}
    >
      Update Client
    </Button>
  );
}
