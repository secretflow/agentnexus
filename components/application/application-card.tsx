"use client";
import { BlurImage } from "@/components/layout";
import { Avatar, Tooltip } from "@/components/ui";
import { DICEBEAR_AVATAR_URL } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";
import type { ApplicationProps } from "@/lib/zod";
import { Rocket } from "lucide-react";
import { Link } from "next-view-transitions";
import { useParams } from "next/navigation";
import { ApplicationTypeBadge } from "./application-types";

export function ApplicationCard({
  id,
  name,
  type,
  image,
  description,
  published,
  user,
  createdAt,
}: ApplicationProps) {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  return (
    <Link
      key={id}
      href={`/${workspaceId}/${id}`}
      className="relative flex flex-col justify-between space-y-4 rounded-lg border border-gray-200 bg-white p-6 transition-[filter] hover:drop-shadow-card-hover"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <BlurImage
            src={image || `${DICEBEAR_AVATAR_URL}${name}`}
            alt={id}
            className="size-10 flex-shrink-0 overflow-hidden rounded-full"
            width={48}
            height={48}
          />
          <div>
            <h2 className="max-w-[200px] truncate font-medium text-gray-700 text-lg">{name}</h2>
          </div>
        </div>
        <ApplicationTypeBadge type={type} />
      </div>
      <div className="truncate font-light text-gray-400 text-sm">{description}</div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-gray-500">
            <Rocket className="h-4 w-4 text-gray-500" />
            <h2 className="whitespace-nowrap text-sm">{published ? "已发布" : "未发布"}</h2>
          </div>
        </div>
        <div className="flex items-center gap-x-1">
          <Tooltip
            content={
              <div className="w-full max-w-xs p-4">
                <Avatar user={user} className="size-10" />
                <div className="mt-2 flex items-center gap-x-1.5">
                  <p className="font-semibold text-gray-700 text-sm">
                    {user.name || "Anonymous User"}
                  </p>
                </div>
                <p className="mt-1 text-gray-500 text-xs">
                  创建于
                  {new Date(createdAt).toLocaleDateString("zh-CN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            }
          >
            <div>
              <Avatar user={user} className="h-4 w-4" />
            </div>
          </Tooltip>
          <p className="text-gray-500 text-xs" suppressHydrationWarning>
            创建于{timeAgo(createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
