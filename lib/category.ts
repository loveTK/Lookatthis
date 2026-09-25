export const CATEGORIES = ["park", "food", "beach", "art", "landmark"] as const;
export type Category = (typeof CATEGORIES)[number] | "other";

// 검색어 형태 그대로: "hidden gem parks near me", "hidden gem lunch spots near me"
export const CATEGORY_NAME: Record<Category, { en: string; ko: string }> = {
  park: { en: "parks", ko: "공원" },
  food: { en: "lunch spots", ko: "맛집" },
  beach: { en: "beaches", ko: "해변" },
  art: { en: "street art", ko: "거리 예술" },
  landmark: { en: "landmarks", ko: "명소" },
  other: { en: "finds", ko: "자랑" },
};

const RULES: [Category, string[]][] = [
  ["beach", ["beach", "sea", "ocean", "coast", "shore", "sand", "wave", "surf"]],
  ["food", ["food", "dish", "cuisine", "restaurant", "cafe", "coffee", "drink", "dessert", "bakery", "meal", "noodle", "ingredient", "snack"]],
  ["art", ["mural", "graffiti", "street art", "painting", "sculpture", "illustration", "poster", "artwork"]],
  ["park", ["park", "garden", "tree", "forest", "nature", "plant", "flower", "mountain", "lake", "trail", "grass", "meadow"]],
  ["landmark", ["landmark", "architecture", "building", "tower", "bridge", "monument", "temple", "church", "skyscraper", "facade", "castle", "palace"]],
];

/** Vision 라벨(신뢰도순)을 카테고리 하나로. 아무것도 안 걸리면 'other'. */
export function categoryFromLabels(labels: string[]): Category {
  const lower = labels.map((l) => l.toLowerCase());
  for (const [cat, words] of RULES) {
    if (lower.some((l) => words.some((w) => l.includes(w)))) return cat;
  }
  return "other";
}

export const isCategory = (s: string): s is Exclude<Category, "other"> => (CATEGORIES as readonly string[]).includes(s);
