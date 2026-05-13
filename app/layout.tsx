import type { Metadata } from "next";
import { Geist_Mono, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const nunitoSans = Nunito_Sans({ subsets: ["latin"], variable: "--font-sans" });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  preload: false,
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Payoy",
    template: "Payoy - %s",
  },
  description: "Aplikasi POS digital untuk operasional bisnis kuliner.",
  icons: {
    icon: "/img/payoy-logo.png",
    shortcut: "/img/payoy-logo.png",
    apple: "/img/payoy-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={cn("h-full", "antialiased", geistMono.variable, "font-sans", nunitoSans.variable)}>
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
