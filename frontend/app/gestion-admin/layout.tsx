import type { Metadata } from "next";
import "./globals.css";
import axios from "axios";


export const metadata: Metadata = {
  title: "Panel de administración",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <section className="flex flex-col items-center justify-center text-center relative absolute top-0 left-0 h-full">
      {children}
    </section>
  );
}
