import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="1200"
      height="1200"
      viewBox="0 0 512 512"
      fill="currentColor"
      className={cn("size-10 text-black dark:text-white", className)}
    >
      <rect
        id="a"
        width="512"
        height="512"
        rx="256"
        fill="#000"
        stroke="#000"
        strokeWidth="0"
        strokeOpacity="100%"
        paintOrder="stroke"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="320"
        height="320"
        viewBox="0 0 24 24"
        x="96"
        y="96"
      >
        <path
          fill="#fff"
          d="M8 16.184V15.5c0-.848.512-1.595 1.287-2.047a7.008 7.008 0 0 1-1.822-1.131C6.561 13.136 6 14.26 6 15.5v.684A2.997 2.997 0 0 0 4 19c0 1.654 1.346 3 3 3s3-1.346 3-3a2.997 2.997 0 0 0-2-2.816zM7 20a1.001 1.001 0 0 1 0-2 1.001 1.001 0 0 1 0 2zm9-12.185v.351c0 .985-.535 1.852-1.345 2.36a7.016 7.016 0 0 1 1.823 1.1C17.414 10.748 18 9.524 18 8.167v-.351A2.997 2.997 0 0 0 20 5c0-1.654-1.346-3-3-3s-3 1.346-3 3c0 1.302.839 2.401 2 2.815zM17 4a1.001 1.001 0 1 1-1 1c0-.551.448-1 1-1zm.935 12.164C17.525 13.251 15.024 11 12 11a4.004 4.004 0 0 1-3.92-3.209A3 3 0 0 0 10 5c0-1.654-1.346-3-3-3S4 3.346 4 5c0 1.326.87 2.44 2.065 2.836C6.475 10.749 8.976 13 12 13a4.004 4.004 0 0 1 3.92 3.209A3 3 0 0 0 14 19c0 1.654 1.346 3 3 3s3-1.346 3-3c0-1.326-.87-2.44-2.065-2.836zM7 4a1.001 1.001 0 1 1-1 1c0-.551.448-1 1-1zm10 16a1.001 1.001 0 0 1 0-2 1.001 1.001 0 0 1 0 2z"
        />
      </svg>
    </svg>
  );
}
