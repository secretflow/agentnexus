import type { VariableRefGroup } from "@/components/workflow/variable";

export interface VariableRefDetail {
  nodeId: string;
  nodeTitle: string;
  variable: string;
}

export function removeWhitespaceBetweenTags(htmlString: string): string {
  let insideTag = false;
  let result = "";

  for (let i = 0; i < htmlString.length; i++) {
    const char = htmlString[i];

    if (char === "<") {
      insideTag = true;
      result += char;
    } else if (char === ">") {
      insideTag = false;
      result += char;
    } else if (insideTag) {
      result += char;
    } else if (!/\s/.test(char)) {
      result += char;
    }
  }

  return result;
}

export function getHtmlForVariableRef(variableRef: VariableRefDetail): string {
  const dataId = `{{${variableRef.nodeId}.${variableRef.variable}}}`;
  const html = `
    <div data-id="${dataId}" class="inline-flex items-center space-x-1 text-xs border font-medium whitespace-nowrap border-gray-200 bg-gray-100 text-gray-800 rounded-md px-1 py-0" contenteditable="false">
      <span>${variableRef.nodeTitle}</span>
      <svg width="5" height="12" viewBox="0 0 5 12" fill="none">
        <path d="M1 11.3545L3.94174 0.645781" stroke="#D0D5DD" stroke-linecap="round"/>
      </svg>
      <span>${variableRef.variable}</span>
    </div>
  `;
  return removeWhitespaceBetweenTags(html);
}

export function parseHtmlString(htmlString: string): Node | null {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  if (!doc.body) {
    return null;
  }

  const firstChild = doc.body.firstChild;

  if (!firstChild) {
    return null;
  }

  return firstChild;
}

export function moveCaretToEnd(elem: HTMLElement) {
  const range = document.createRange();
  range.selectNodeContents(elem);
  range.collapse(false);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
  elem.focus();
}

export function insertVariableRefAtCaret(variableRef: VariableRefDetail) {
  const range = window.getSelection()?.getRangeAt(0);
  if (!range) return;

  const dom = parseHtmlString(getHtmlForVariableRef(variableRef));
  if (dom) {
    range.insertNode(dom);
    range.setStartAfter(dom);
    range.collapse(true);
  }
}

export function parseVariableValue(value: string, availableVariableRefs: VariableRefGroup[]) {
  let parsedHtml = "";
  const segments = value.split("\n").filter((s) => s.trim() !== "");

  if (segments.length === 1) {
    parsedHtml = segments[0];
  } else {
    parsedHtml = segments
      .map((s, _i) => {
        return `<div>${s}</div>`;
      })
      .join("");
  }

  return parsedHtml.replace(/\{\{([a-zA-Z0-9_.\-]+)\}\}/g, (_, key: string) => {
    const keys = key.split(".");
    if (keys.length !== 2) {
      return key;
    }

    const [nodeId, variable] = keys;
    const group = availableVariableRefs.find((group) => group.nodeId === nodeId);
    if (!group) {
      return key;
    }

    const variableRef = group.variables.find((v) => v.name === variable);
    if (!variableRef) {
      return key;
    }

    return getHtmlForVariableRef({
      nodeId,
      nodeTitle: group.title,
      variable,
    });
  });
}

export function formatVariableValue(elem: HTMLDivElement) {
  const results: string[] = [];
  const childNodes = elem.childNodes;
  for (let i = 0; i < childNodes.length; i++) {
    const node = childNodes[i];
    if (node.nodeType === Node.TEXT_NODE) {
      results.push(node.textContent || "");
    } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === "DIV") {
      const div = node as HTMLDivElement;
      if (div.dataset.id) {
        results.push(div.dataset.id);
      } else {
        const content = div.textContent;
        if (content) {
          results.push("\n");
          results.push(content);
        }
      }
    }
  }

  return results.join("");
}
