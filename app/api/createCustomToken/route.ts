import { adminAuth } from "@/lib/firebase/serverApp";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const res = await req.json();

  try {
    const uid = res.user.email;
    const customToken = await adminAuth.createCustomToken(res.user.email);
    return NextResponse.json({ token: customToken });
  } catch (error) {
    console.error("Error creating custom token:", error);
    return NextResponse.json({ message: "Error creating custom token" });
  }
}
