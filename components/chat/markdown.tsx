import Link from "next/link";
import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type AnyType = any;

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  const components = {
    code: ({ node, inline, className, children, ...props }: AnyType) => {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <pre
          {...props}
          className={`${className} mt-2 w-[80dvw] overflow-x-scroll rounded-lg bg-zinc-100 p-3 text-sm md:max-w-[500px] dark:bg-zinc-800`}
        >
          <code className={match[1]}>{children}</code>
        </pre>
      ) : (
        <code
          className={`${className} rounded-md bg-zinc-100 px-1 py-0.5 text-sm dark:bg-zinc-800`}
          {...props}
        >
          {children}
        </code>
      );
    },
    ol: ({ node, children, ...props }: AnyType) => {
      return (
        <ol className="ml-4 list-outside list-decimal" {...props}>
          {children}
        </ol>
      );
    },
    li: ({ node, children, ...props }: AnyType) => {
      return (
        <li className="py-1" {...props}>
          {children}
        </li>
      );
    },
    ul: ({ node, children, ...props }: AnyType) => {
      return (
        <ul className="ml-4 list-outside list-decimal" {...props}>
          {children}
        </ul>
      );
    },
    strong: ({ node, children, ...props }: AnyType) => {
      return (
        <span className="font-semibold" {...props}>
          {children}
        </span>
      );
    },
    a: ({ node, children, ...props }: AnyType) => {
      return (
        <Link className="text-blue-500 hover:underline" target="_blank" rel="noreferrer" {...props}>
          {children}
        </Link>
      );
    },
    h1: ({ node, children, ...props }: AnyType) => {
      return (
        <h1 className="mt-6 mb-2 font-semibold text-3xl" {...props}>
          {children}
        </h1>
      );
    },
    h2: ({ node, children, ...props }: AnyType) => {
      return (
        <h2 className="mt-6 mb-2 font-semibold text-2xl" {...props}>
          {children}
        </h2>
      );
    },
    h3: ({ node, children, ...props }: AnyType) => {
      return (
        <h3 className="mt-6 mb-2 font-semibold text-xl" {...props}>
          {children}
        </h3>
      );
    },
    h4: ({ node, children, ...props }: AnyType) => {
      return (
        <h4 className="mt-6 mb-2 font-semibold text-lg" {...props}>
          {children}
        </h4>
      );
    },
    h5: ({ node, children, ...props }: AnyType) => {
      return (
        <h5 className="mt-6 mb-2 font-semibold text-base" {...props}>
          {children}
        </h5>
      );
    },
    h6: ({ node, children, ...props }: AnyType) => {
      return (
        <h6 className="mt-6 mb-2 font-semibold text-sm" {...props}>
          {children}
        </h6>
      );
    },
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);
