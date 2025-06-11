import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { getOrCreateSession } from "@/lib/sessionService";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Romika Store",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await getOrCreateSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
