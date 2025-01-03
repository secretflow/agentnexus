import { Book } from "@/components/icons";
import { BlurImage } from "@/components/layout";
import { Avatar, Badge, Tooltip } from "@/components/ui";
import { DICEBEAR_AVATAR_URL } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";
import type { WorkspaceWithRoleProps } from "@/lib/zod";
import { MixIcon } from "@radix-ui/react-icons";
import { Hammer, Users } from "lucide-react";
import { Link } from "next-view-transitions";

export function WorkspaceCard({
  id,
  name,
  image,
  isOwner,
  members,
  user,
  createdAt,
  applications,
  knowledgebases,
}: WorkspaceWithRoleProps) {
  const memberNum = members.length + 1;
  const applicationNum = applications.length;
  const knowledgebaseNum = knowledgebases.length;

  return (
    <Link
      key={id}
      href={`/${id}`}
      className="relative flex flex-col justify-between space-y-10 rounded-lg border border-gray-200 bg-white p-6 transition-[filter] hover:drop-shadow-card-hover"
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
        <Badge variant={isOwner ? "rainbow" : "sky"}>{isOwner ? "owner" : "member"}</Badge>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Tooltip content={`${applicationNum} 个应用`} side="bottom">
            <div className="flex items-center space-x-1 text-gray-500">
              <MixIcon className="h-4 w-4" />
              <h2 className="whitespace-nowrap text-sm">{applicationNum}</h2>
            </div>
          </Tooltip>

          <Tooltip content={`${knowledgebaseNum} 个知识库`} side="bottom">
            <div className="flex items-center space-x-1 text-gray-500">
              <Book className="h-4 w-4 text-gray-700" />
              <h2 className="whitespace-nowrap text-sm">{knowledgebaseNum}</h2>
            </div>
          </Tooltip>

          <Tooltip content="0 个 工具" side="bottom">
            <div className="flex items-center space-x-1 text-gray-500">
              <Hammer className="h-4 w-4" />
              <h2 className="whitespace-nowrap text-sm">0</h2>
            </div>
          </Tooltip>

          <Tooltip content={`${memberNum} 位成员`} side="bottom">
            <div className="flex items-center space-x-1 text-gray-500">
              <Users className="h-4 w-4" />
              <h2 className="whitespace-nowrap text-sm">{memberNum}</h2>
            </div>
          </Tooltip>
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
