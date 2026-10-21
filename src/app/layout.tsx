import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Parcel | Delivery, made clear",
  description: "A simpler way to manage deliveries and keep every parcel in view. Coming soon.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={sora.className}>{children}</body></html>;
}
