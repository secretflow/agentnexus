import type { SplitConfigProps } from "@/lib/zod";
import { MarkdownTextSplitter, RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { extractRawText } from "mammoth";
import { NodeHtmlMarkdown } from "node-html-markdown";
import pdf from "pdf-parse";

export async function readFileContent(file: File, fileType: string) {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (fileType === "pdf") {
    const { text } = await pdf(buffer);
    return text;
  }

  if (fileType === "docx") {
    const { value } = await extractRawText({
      buffer,
    });
    return value;
  }

  return buffer.toString("utf-8");
}

export async function splitDocument(
  file: File,
  fileType: string,
  { chunkSize = 500, chunkOverlap = 50, separators }: SplitConfigProps,
) {
  let content = await readFileContent(file, fileType);
  const separatorList = separators ? separators.split(",") : [];

  let textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
    separators: separatorList.concat(["\n\n", "\n", " ", ""]),
  });

  switch (fileType) {
    case "md":
      textSplitter = new MarkdownTextSplitter({
        chunkSize,
        chunkOverlap,
      });
      break;
    case "html":
      content = NodeHtmlMarkdown.translate(content);
      textSplitter = new MarkdownTextSplitter({
        chunkSize,
        chunkOverlap,
      });
    default:
      break;
  }

  return await textSplitter.createDocuments([content]);
}
