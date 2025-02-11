import { Simulator } from "@/lib/simulator";
import { NextResponse } from "next/server";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type ToolProps = { toolName: string; args: any };

export const POST = async (req: Request) => {
  const {
    tool,
  }: {
    tool: ToolProps;
  } = await req.json();
  let result = null;
  const simulator = Simulator.getInstance();

  switch (tool.toolName) {
    case "loadPage":
      await simulator.loadPage(tool.args.url);
      break;
    case "locatorFill":
      await simulator.locatorFill(tool.args.cssSelector, tool.args.value);
      break;
    case "locatorClick":
      await simulator.locatorClick(tool.args.cssSelector);
      break;
    case "locatorCheck":
      await simulator.locatorCheck(tool.args.cssSelector);
      break;
    case "locatorInnerText":
      result = await simulator.locatorInnerText(tool.args.cssSelector);
      break;
    default:
      break;
  }

  const dataURL = await simulator.screenshot();

  return NextResponse.json({ screenshot: dataURL, result }, { status: 200 });
};
