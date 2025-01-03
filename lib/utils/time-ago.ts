import ms from "ms";

export const timeAgo = (
  timestamp: Date | null,
  {
    withAgo = true,
  }: {
    withAgo?: boolean;
  } = {},
): string => {
  if (!timestamp) return "Never";
  const diff = Date.now() - new Date(timestamp).getTime();
  if (diff < 1000) {
    return "刚刚";
  } else if (diff > 82800000) {
    return new Date(timestamp).toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
      year: new Date(timestamp).getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    });
  }
  return `${ms(diff)}${withAgo ? " 之前" : ""}`;
};
