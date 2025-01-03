import { getEmbeddings, getKnowledgebase } from "@/lib/api";
import { getEmbeddingModel } from "@/lib/model";
import type { ModelProps, RetrievalResultProps } from "@/lib/zod";
import { type EmbeddingModel, cosineSimilarity, embed, embedMany } from "ai";

export async function generateEmbeddings(values: string[], model: EmbeddingModel<string>) {
  const { embeddings } = await embedMany({
    model,
    values,
  });
  return embeddings;
}

export async function generateEmbedding(
  value: string,
  model: EmbeddingModel<string>,
): Promise<number[]> {
  const input = value.replaceAll("\n", " ");
  const { embedding } = await embed({
    model,
    value: input,
  });
  return embedding;
}

export async function findRelevantContent(
  questions: string[],
  knowledgebaseIds: string[],
  threshold = 0.3,
  top = 10,
) {
  const result: RetrievalResultProps[] = [];

  for (let i = 0, len = knowledgebaseIds.length; i < len; i++) {
    const knowledgebase = await getKnowledgebase(knowledgebaseIds[i], undefined, false);
    if (!knowledgebase) {
      continue;
    }
    const model = knowledgebase.model as ModelProps;
    const embeddingModel = getEmbeddingModel(model.provider, model.id);
    if (!embeddingModel) {
      continue;
    }
    const embeddings = await getEmbeddings(knowledgebase.id);
    const questionsEmbedding = await generateEmbeddings(questions, embeddingModel);

    embeddings.forEach(({ id, content, embedding, resourceId, knowledgebaseId }) => {
      questionsEmbedding.forEach((qe) => {
        const similarity = cosineSimilarity(qe, JSON.parse(embedding));
        if (similarity > threshold && !result.find((r) => r.id === id)) {
          result.push({ id, content, similarity, resourceId, knowledgebaseId });
        }
      });
    });
  }

  result.sort((a, b) => b.similarity - a.similarity);

  const topK = result.slice(0, top);

  return topK;
}
