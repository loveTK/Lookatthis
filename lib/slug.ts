export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

export const postPath = (id: number, title: string) => `/p/${id}-${slugify(title) || "post"}`;

export const idFromSlug = (slug: string) => {
  const id = Number.parseInt(slug, 10);
  return Number.isFinite(id) && id > 0 ? id : null;
};

export const money = (n: number | null | undefined) =>
  n == null ? null : `$${Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
