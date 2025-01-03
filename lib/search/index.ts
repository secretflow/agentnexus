import type { ApplicationProps, KnowledgebaseProps } from "@/lib/zod";
import { simpleSearch } from "./search";

export const searchApplications = (
  applications: ApplicationProps[],
  query?: string,
): ApplicationProps[] => {
  if (!query) return applications;

  return simpleSearch(applications, { name: 1, description: 0.5 }, query);
};

export const searchKnowledgebases = (
  knowledgebases: KnowledgebaseProps[],
  query?: string,
): KnowledgebaseProps[] => {
  if (!query) return knowledgebases;

  return simpleSearch(knowledgebases, { name: 1, description: 0.5 }, query);
};
