import { v4 as uuidv4 } from "uuid";

export function generateSlug(title: string, id?: string): string {
  const slugifiedTitle = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-") // spaces → hyphens
    .replace(/-+/g, "-"); // collapse multiple hyphens

  const uuidPart = (id ?? uuidv4()).split("-")[0]; // short & readable

  return `${slugifiedTitle}-${uuidPart}`;
}
