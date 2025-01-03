import type { Metadata } from "next";

export function constructMetadata({
  title = `${process.env.NEXT_PUBLIC_APP_NAME} - 构建、部署、扩展，一站式大模型应用研发平台`,
  description = `${process.env.NEXT_PUBLIC_APP_NAME} 是一个低代码的大模型应用研发平台，提供一站式解决方案，帮助您快速构建、高效部署和灵活扩展各种大模型应用，显著缩短开发周期，降低开发成本。`,
  image,
  video,
  icons = "/favicon.ico",
  canonicalUrl,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string | null;
  video?: string | null;
  icons?: Metadata["icons"];
  canonicalUrl?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(image && {
        images: image,
      }),
      ...(video && {
        videos: video,
      }),
    },
    twitter: {
      title,
      description,
      ...(image && {
        card: "summary_large_image",
        images: [image],
      }),
      ...(video && {
        player: video,
      }),
      creator: "@next-agent-flow",
    },
    icons,
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_APP_URL}`),
    ...(canonicalUrl && {
      alternates: {
        canonical: canonicalUrl,
      },
    }),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
