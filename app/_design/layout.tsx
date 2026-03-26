import type { Metadata } from "next";
import "./design.css";

export const metadata: Metadata = {
  title: "[RS_DESIGN] — Ryyan Safar",
  description: "Design & frontend portfolio. CRT immersive experience. Horizontal scroll.",
};

export default function DesignLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
