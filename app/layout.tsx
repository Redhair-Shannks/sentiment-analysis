"use client";
import { Geist_Mono as GeistMono, Geist as Geist } from "next/font/google";

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { FlaskResponseProvider } from "./context/FlaskResponseContext";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = GeistMono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <FlaskResponseProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="flex justify-between">
          <SignedOut>
          <div className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            <SignInButton />
          </div>
            </SignedOut>
            <SignedIn>
            <div className="flex items-center space-x-2">
               <UserButton
               showName
               appearance={{
                elements: {
                  userButtonBox: "bg-gray-900 text-white hover:bg-gray-700 rounded-full p-2",
                  userButtonText: "text-white",
                },
              }}
              />
              </div>
            </SignedIn>
        </header>
        {children}
      </body>
    </html>
    </FlaskResponseProvider>
    </ClerkProvider>
  );
}
