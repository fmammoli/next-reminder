import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  if (
    searchParams.has("day") &&
    searchParams.has("month") &&
    searchParams.has("year")
  ) {
    return NextResponse.next();
  }
  const today = new Date();
  const day = today.toLocaleString("pt-Br", { day: "2-digit" });
  const month = today.toLocaleString("pt-Br", { month: "2-digit" });
  const year = today.toLocaleString("pt-Br", { year: "numeric" });

  return NextResponse.redirect(
    new URL(`?day=${day}&month=${month}&year=${year}`, request.url)
  );
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/reminders",
};
