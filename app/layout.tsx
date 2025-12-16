import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Docr - Documentation on Autopilot",
  description: "Automated documentation generation for your GitHub repositories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
