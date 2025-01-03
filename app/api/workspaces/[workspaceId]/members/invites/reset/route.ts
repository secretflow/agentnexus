import { responseData, updateWorkspace } from "@/lib/api";
import { withWorkspace } from "@/lib/auth";
import { nanoid } from "@/lib/utils";

export const POST = withWorkspace(async ({ workspace }) => {
  const updatedWorkspace = updateWorkspace(workspace.id, {
    inviteCode: nanoid(24),
  });

  return responseData(updatedWorkspace);
});
