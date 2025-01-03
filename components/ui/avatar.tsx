import { DICEBEAR_AVATAR_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Avatar({
  user = {},
  className,
}: {
  user?: {
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
  };
  className?: string;
}) {
  if (!user) {
    return (
      <div
        className={cn(
          "size-10 animate-pulse rounded-full border border-gray-300 bg-gray-100",
          className,
        )}
      />
    );
  }

  return (
    <img
      alt={`Avatar for ${user.name || user.email}`}
      referrerPolicy="no-referrer"
      src={user.image || `${DICEBEAR_AVATAR_URL}${user.email}`}
      className={cn("size-10 rounded-full border border-gray-300", className)}
      draggable={false}
    />
  );
}
