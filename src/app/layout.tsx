import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ScalpMaster AI",
  description: "Automated crypto scalping bot dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main style={{ maxWidth: 920, padding: 24, margin: "0 auto", fontFamily: "Inter, system-ui, Arial" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
