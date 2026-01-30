import { v4 as uuid } from "uuid";

export function generateSlug(title: string, id?: string): string {
  const slug = title
    .toLowerCase()
    .trim()
    .replaceAll(/[^\w\s-]/g, "") // remove special chars
    .replaceAll(/\s+/g, "-") // spaces → hyphens
    .replaceAll(/-+/g, "-"); // collapse multiple hyphens

  const [uuidPart] = (id ?? uuid()).split("-"); // short & readable

  return `${slug}-${uuidPart}`;
}
