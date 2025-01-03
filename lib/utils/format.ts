export function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(2)}${units[i]}`;
}

export function toPercentage(decimal: number): string {
  const percentage = decimal * 100;
  const roundedPercentage = parseFloat(percentage.toFixed(2)); // 保留两位小数
  return `${roundedPercentage}%`;
}

export function capitalize(str?: string | null) {
  if (!str || typeof str !== "string") return str;
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
