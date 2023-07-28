import "./globals.css";
import { Inter } from "next/font/google";
import { NextAuthProvider } from "./providers";
import FirebaseSessionHandler from "./FirebaseSessionHandler";
import Nav from "./Nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "My Reminders",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* <body className={inter.className}> */}
      <body>
        <NextAuthProvider>
          <header className="sticky top-[1rem] mt-6 mb-4 z-10">
            <FirebaseSessionHandler>
              <Nav></Nav>
            </FirebaseSessionHandler>
          </header>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
