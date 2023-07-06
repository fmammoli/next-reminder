import { adminAuth } from "@/lib/firebase/serverApp";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const res = await req.json();
    const customToken = await adminAuth.createCustomToken(res.email);
    return NextResponse.json({ token: customToken });
  } catch (error) {
    // throw new Error("Error creating custom token:" + error);
    return NextResponse.json({ message: "Error creating custom token" });
  }
}
