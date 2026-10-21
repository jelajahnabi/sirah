import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

type FontDef = {
  family: string;
  file: string;
  weight: string;
  style?: "normal" | "italic";
};

const FONT_FILES: FontDef[] = [
  { family: "Playfair Display", file: "playfair-display-latin-600-normal.woff2", weight: "600" },
  { family: "Playfair Display", file: "playfair-display-latin-700-normal.woff2", weight: "700" },
  { family: "Playfair Display", file: "playfair-display-latin-800-normal.woff2", weight: "800" },
  { family: "Playfair Display", file: "playfair-display-latin-900-normal.woff2", weight: "900" },
  { family: "Playfair Display", file: "playfair-display-latin-700-italic.woff2", weight: "700", style: "italic" },
  { family: "Inter", file: "inter-latin-400-normal.woff2", weight: "400" },
  { family: "Inter", file: "inter-latin-500-normal.woff2", weight: "500" },
  { family: "Inter", file: "inter-latin-600-normal.woff2", weight: "600" },
  { family: "Inter", file: "inter-latin-700-normal.woff2", weight: "700" },
  { family: "Inter", file: "inter-latin-800-normal.woff2", weight: "800" },
  { family: "Amiri", file: "amiri-arabic-700-normal.woff2", weight: "700" },
];

let loaded = false;

/** Loads the series fonts from /public/assets/fonts. Remotion waits for them before rendering. */
export const loadSeriesFonts = () => {
  if (loaded) return;
  loaded = true;
  for (const f of FONT_FILES) {
    loadFont({
      family: f.family,
      url: staticFile(`assets/fonts/${f.file}`),
      weight: f.weight,
      style: f.style ?? "normal",
    });
  }
};
