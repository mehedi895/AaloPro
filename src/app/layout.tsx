import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "AaloPro | Pilot overview",
  description: "Private pilot dashboard prototype. Synthetic demo data only.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
