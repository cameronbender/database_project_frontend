import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pokémon Team Builder",
  description: "Build your ultimate Pokémon team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="bg-red-600 text-white py-3 px-4 shadow-md">
          <div className="container mx-auto flex items-center justify-center">
            <h1 className="text-xl font-bold text-center">Pokémon Team Builder</h1>

          </div>
        </header>
        {children}
      </body>
    </html>
  );
}