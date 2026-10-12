/**
 * Hobbiverse 50-Colour Token Palette & Semantic Design System
 * 
 * Source of truth for Burgundy Botanical Atelier palette.
 */

export const PALETTE = {
  // Burgundy / rose anchor (10)
  wine950: "#3B0A20",
  wine900: "#4A102A",
  wine800: "#5C1736",
  wine700: "#6D1D43",
  wine600: "#7F2A50",
  wine500: "#963E62",
  rose700: "#B85A79",
  rose500: "#D7839A",
  rose300: "#E9AEBB",
  rose100: "#F6D3DB",

  // Paper / ink neutrals (12)
  paper50: "#FFFCFA",
  paper100: "#FBF6F1",
  paper200: "#F4ECE5",
  paper300: "#E9DDD3",
  sand400: "#D7C4B8",
  stone500: "#B8A59A",
  stone600: "#8F7F76",
  ink600: "#665852",
  ink700: "#463A3D",
  ink800: "#2C2228",
  ink950: "#1A151B",
  pureWhite: "#FFFFFF",

  // Sage / forest family (4)
  sage100: "#E5F2E8",
  sage300: "#B9D8C0",
  sage500: "#78AD88",
  forest700: "#447B5A",

  // Sky / ocean family (4)
  sky100: "#E8F2FA",
  sky300: "#BCD8EE",
  sky500: "#6D9CC6",
  ocean700: "#315F87",

  // Lavender / iris family (4)
  lilac100: "#F0E9F8",
  lilac300: "#D8C5EE",
  iris500: "#A88AD0",
  plum700: "#70509A",

  // Peach / terracotta family (4)
  peach100: "#FFF0E8",
  peach300: "#F4CDB9",
  apricot500: "#EAA07F",
  clay700: "#B96243",

  // Marigold / amber family (4)
  butter100: "#FFF6D9",
  butter300: "#F2D27D",
  amber500: "#C9A23D",
  ochre700: "#80621C",

  // Teal / lagoon family (4)
  lagoon100: "#E2F4F2",
  lagoon300: "#A7DCD5",
  teal500: "#54AAA1",
  deepTeal700: "#246E69",

  // Coral / berry family (4)
  coral100: "#FCE9E7",
  coral300: "#F2B0A7",
  coral500: "#D76F68",
  berry700: "#9B3D45",
} as const;

export type PaletteKey = keyof typeof PALETTE;

export interface CategoryColorTheme {
  id: string;
  name: string;
  bgSubtle: string;
  bgLight: string;
  accent: string;
  textStrong: string;
  border: string;
  colorFamilyName: string;
}

/**
 * Stable category-to-colour mappings
 */
export const CATEGORY_THEMES: Record<string, CategoryColorTheme> = {
  "art-craft": {
    id: "art-craft",
    name: "Art & Craft",
    bgSubtle: PALETTE.peach100,
    bgLight: PALETTE.peach300,
    accent: PALETTE.apricot500,
    textStrong: PALETTE.clay700,
    border: PALETTE.peach300,
    colorFamilyName: "Peach & Clay",
  },
  "outdoors-nature": {
    id: "outdoors-nature",
    name: "Outdoors & Nature",
    bgSubtle: PALETTE.sage100,
    bgLight: PALETTE.sage300,
    accent: PALETTE.sage500,
    textStrong: PALETTE.forest700,
    border: PALETTE.sage300,
    colorFamilyName: "Sage & Forest",
  },
  "music": {
    id: "music",
    name: "Music",
    bgSubtle: PALETTE.lilac100,
    bgLight: PALETTE.lilac300,
    accent: PALETTE.iris500,
    textStrong: PALETTE.plum700,
    border: PALETTE.lilac300,
    colorFamilyName: "Lavender & Plum",
  },
  "cooking": {
    id: "cooking",
    name: "Cooking & Baking",
    bgSubtle: PALETTE.butter100,
    bgLight: PALETTE.butter300,
    accent: PALETTE.amber500,
    textStrong: PALETTE.ochre700,
    border: PALETTE.butter300,
    colorFamilyName: "Marigold & Ochre",
  },
  "movement": {
    id: "movement",
    name: "Movement & Wellbeing",
    bgSubtle: PALETTE.sky100,
    bgLight: PALETTE.sky300,
    accent: PALETTE.sky500,
    textStrong: PALETTE.ocean700,
    border: PALETTE.sky300,
    colorFamilyName: "Sky & Ocean",
  },
  "mindful": {
    id: "mindful",
    name: "Mindful Moments",
    bgSubtle: PALETTE.lagoon100,
    bgLight: PALETTE.lagoon300,
    accent: PALETTE.teal500,
    textStrong: PALETTE.deepTeal700,
    border: PALETTE.lagoon300,
    colorFamilyName: "Teal & Lagoon",
  },
  "reading-writing": {
    id: "reading-writing",
    name: "Reading & Writing",
    bgSubtle: PALETTE.rose100,
    bgLight: PALETTE.rose300,
    accent: PALETTE.rose700,
    textStrong: PALETTE.wine700,
    border: PALETTE.rose300,
    colorFamilyName: "Burgundy & Rose",
  },
  "social-games": {
    id: "social-games",
    name: "Social & Games",
    bgSubtle: PALETTE.coral100,
    bgLight: PALETTE.coral300,
    accent: PALETTE.coral500,
    textStrong: PALETTE.berry700,
    border: PALETTE.coral300,
    colorFamilyName: "Coral & Berry",
  },
};

/**
 * Chart & progress visualization colors
 */
export const PROGRESS_SERIES = [
  PALETTE.wine700,
  PALETTE.forest700,
  PALETTE.deepTeal700,
  PALETTE.amber500,
  PALETTE.clay700,
  PALETTE.plum700,
  PALETTE.ocean700,
  PALETTE.coral500,
] as const;

export function getCategoryTheme(slugOrCategory: string): CategoryColorTheme {
  const normalized = slugOrCategory.toLowerCase().trim().replace(/\s+/g, "-");
  return CATEGORY_THEMES[normalized] || CATEGORY_THEMES["art-craft"];
}
