import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Punk Album of the Day",
  description: "A punk, hardcore, ska-punk or emo album to listen to every day.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
