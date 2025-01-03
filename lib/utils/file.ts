export function getFileExtension(filename: string): string {
  const extension = filename.split(".").pop();
  return extension || "";
}
