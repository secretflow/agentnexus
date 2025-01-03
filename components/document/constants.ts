import { DocxIcon, HtmlIcon, MarkdownIcon, PdfIcon } from "@/components/icons";
import { FileType } from "lucide-react";
import type { ElementType } from "react";

export const DOCUMENT_ICONS: Record<string, ElementType> = {
  txt: FileType,
  pdf: PdfIcon,
  html: HtmlIcon,
  docx: DocxIcon,
  md: MarkdownIcon,
};
