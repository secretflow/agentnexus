import { Book, CloudSun, End, Fire, Globe2 } from "@/components/icons";
import { BrickWall, CodeXml, House, Package } from "lucide-react";

export enum SCENE {
  workflow = "workflow",
  agent = "agent",
}

// Note: Keep the key and id the same
export const NODE_ATTRS = {
  start: {
    id: "start",
    name: "开始",
    introduction: "工作流的开始节点",
    icon: House,
    scene: [] as SCENE[],
  },
  llm: {
    id: "llm",
    name: "LLM",
    introduction: "调用大模型对自然语言进行处理",
    icon: Package,
    scene: ["workflow"] as SCENE[],
  },
  condition: {
    id: "condition",
    name: "条件",
    introduction: "根据条件将工作流拆分成多个分支",
    icon: House,
    scene: [] as SCENE[],
  },
  repeat: {
    id: "repeat",
    name: "迭代",
    introduction: "todo",
    icon: House,
    scene: [] as SCENE[],
  },
  end: {
    id: "end",
    name: "结束",
    introduction: "工作流的结束节点",
    icon: End,
    scene: ["workflow"] as SCENE[],
  },
};

// Note: Keep the key and id the same
export const TOOL_ATTRS = {
  weather: {
    id: "weather",
    name: "天气查询",
    introduction: "基于 weatherapi.com 的天气查询工具",
    icon: CloudSun,
    toolName: "get_current_weather",
    scene: ["workflow", "agent"] as SCENE[],
  },
  executePython: {
    id: "executePython",
    name: "代码执行",
    introduction: "在 E2B 的安全沙箱环境中执行 Python 代码",
    icon: CodeXml,
    toolName: "execute_python",
    scene: ["workflow", "agent"] as SCENE[],
  },
  knowledgeRetrieval: {
    id: "knowledgeRetrieval",
    name: "知识检索",
    introduction: "在给定的知识库中搜索相关的信息",
    icon: Book,
    toolName: "getInformation",
    scene: ["workflow"] as SCENE[],
  },
  webSearch: {
    id: "webSearch",
    name: "互联网搜索",
    introduction: "在互联网上搜索相关的信息",
    icon: Globe2,
    toolName: "exa_search",
    scene: ["agent"] as SCENE[],
  },
  firecrawl: {
    id: "firecrawl",
    name: "网络爬虫",
    introduction: "基于 FireCrawl 进行网络数据抓取",
    icon: Fire,
    toolName: "firecrawl_scrape_url",
    scene: ["agent"] as SCENE[],
  },
  autoPlaywright: {
    id: "autoPlaywright",
    name: "UI 自动化",
    introduction: "使用 Playwright 进行自动化操作",
    icon: BrickWall,
    toolName: "auto_playwright",
    scene: ["agent"] as SCENE[],
  },
};
