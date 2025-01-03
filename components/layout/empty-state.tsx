import { buttonVariants } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Link } from "next-view-transitions";

export function EmptyState({
  icon: Icon,
  title,
  description,
  learnMore,
  buttonText,
  buttonLink,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
  learnMore?: string;
  buttonText?: string;
  buttonLink?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
        <Icon className="size-8 text-black" strokeWidth={0.75} />
      </div>
      <p className="text-center font-medium text-base text-gray-950">{title}</p>
      {description && (
        <p className="max-w-sm text-center text-gray-500 text-sm">
          {description}{" "}
          {learnMore && (
            <a
              href={learnMore}
              target="_blank"
              className="underline underline-offset-2 hover:text-gray-800"
            >
              更多 ↗
            </a>
          )}
        </p>
      )}
      {buttonText && buttonLink && (
        <Link
          href={buttonLink}
          {...(buttonLink.startsWith("http") ? { target: "_blank" } : {})}
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "flex h-8 items-center justify-center gap-2 rounded-md border px-4 text-sm",
          )}
        >
          <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
            {buttonText}
          </span>
        </Link>
      )}
    </div>
  );
}
