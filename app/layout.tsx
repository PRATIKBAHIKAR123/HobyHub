
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "./sidebar/sidebarContext";
import ClientLayout from "./ClientLayout";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hoby Hub",
  description: "Hoby Hub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <PagesNavbar/> */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
            <SidebarProvider>  {/* ✅ Ensure this wraps all components */}
      <ClientLayout>{children}</ClientLayout>
    </SidebarProvider>
    <Toaster richColors position="top-right"/>
      </body>
    </html>
  );
}
