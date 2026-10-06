export function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);

  return date
    .toLocaleDateString("en-GB")
    .replaceAll("/", ".");
}