// knowledgebase
export const MAX_KNOWLEDGE_FILE_SIZE = 1024 * 1024 * 1024;
export const ALLOWED_KNOWLEDGE_FILE_TYPES = ["txt", "html", "pdf", "docx", "md"];
export const DEFAULT_RECALL_CONFIG = {
  topK: 3,
  score: 0.3,
  semantics: 1,
};

// model
export const DEFAULT_MODEL = {
  provider: "openai",
  id: "gpt-4o-mini",
};
export const DEFAULT_MODEL_CONFIG = {
  temperature: 0,
  maxTokens: 512,
  presencePenalty: 0,
  frequencyPenalty: 0,
};
