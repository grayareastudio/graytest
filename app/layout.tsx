import type { Metadata } from "next";
import { Fira_Sans, Hedvig_Letters_Serif } from "next/font/google";
import "./globals.css";

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

const hedvig = Hedvig_Letters_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Gray Area",
  description: "gray area",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${firaSans.variable} ${hedvig.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-linear-to-tr from-black to-[#171717]">
        {children}
      </body>
    </html>
  );
}
