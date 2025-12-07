import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import AuthInitializer from "@/components/AuthInitializer";
import { getAuthStatus } from "@/app/(auth)/login/actions";

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
  const { isAuthenticated, role } = await getAuthStatus();

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthInitializer isAuthenticated={isAuthenticated} role={role} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
