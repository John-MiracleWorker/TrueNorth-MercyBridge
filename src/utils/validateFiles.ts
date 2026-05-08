export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateFiles(
  files: File[],
  allowedTypes: string[],
  maxCount: number,
  label: string
): string | null {
  if (files.length === 0) return null;
  if (files.length > maxCount) {
    return `${label}: maximum ${maxCount} files allowed.`;
  }
  for (const file of files) {
    if (!allowedTypes.includes(file.type)) {
      return `${label}: "${file.name}" is not an allowed file type. Allowed: ${allowedTypes.map((t) => t.split('/')[1]).join(', ')}.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `${label}: "${file.name}" exceeds 10MB limit.`;
    }
  }
  return null;
}
