import { GeistMono } from "geist/font/mono";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

export const satoshi = localFont({
  src: "./Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  weight: "300 900",
  display: "swap",
  style: "normal",
  preload: false,
});

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  preload: false,
});

export const geistMono = GeistMono;
