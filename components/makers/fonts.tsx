import { Anton, Great_Vibes, Pacifico, Press_Start_2P } from "next/font/google";
import type { ReactNode } from "react";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const pacifico = Pacifico({ weight: "400", subsets: ["latin"], variable: "--font-pacifico" });
const vibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-vibes" });
const pixel = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-pixel" });

export function MakerFonts({ children }: { children: ReactNode }) {
  return (
    <div className={`${anton.variable} ${pacifico.variable} ${vibes.variable} ${pixel.variable}`}>
      {children}
    </div>
  );
}
