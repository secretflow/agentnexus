import { responseData } from "@/lib/api";
import { withWorkspace } from "@/lib/auth";
import { getLanguageModelList } from "@/lib/model";

export const GET = withWorkspace(async () => {
  const results = await getLanguageModelList();
  return responseData(results);
});
