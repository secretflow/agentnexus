import { findRelevantContent, generateSimilarQuestions } from "@/lib/ai";
import { DEFAULT_MODEL, DEFAULT_RECALL_CONFIG, TOOL_ATTRS } from "@/lib/constants";
import { getLanguageModel } from "@/lib/model";
import { Simulator } from "@/lib/simulator";
import type { ChatConfigProps } from "@/lib/zod";
import { createAIFunction } from "@agentic/core";
import { type LanguageModelV1, generateObject } from "ai";
import { z } from "zod";
import { registerToolProvider } from "./registry";

registerToolProvider({
  ...TOOL_ATTRS.autoPlaywright,

  async call() {
    // pass
  },

  getAiFunction(args: {
    model: LanguageModelV1;
  }) {
    return createAIFunction(
      {
        name: "auto_playwright",
        description: "automate operations web page according to user instruction.",
        inputSchema: z.object({
          instruction: z.string().describe("the users instruction"),
        }),
      },
      async ({ instruction }) => {
        const { model } = args;

        const { object } = await generateObject({
          model,
          system: `
## Role

You are a versatile professional in software UI automation. Your outstanding contributions will impact the user experience of billions of users.

## Objective

- Decompose the instruction user asked into a series of tools
- Locate the target element use cssSelector if possible
- Evaluate whether the result given by the user are consistent with the actual result

## Workflow

1. Receive the user's html page.
2. Decompose the user's task into a sequence of tools, and place it in the \`tools\` field. There are different types of actions (locatorFill / locatorClick / locatorCheck / locatorInnerText). The section below will give you more details.

[
    {{
      "type": "loadPage", 
      "thought": "load a page by url.",
      "params": {{
        "url": ""
      }},
    }},
    {{
      "type": "locatorFill", 
      "thought": "Set a value to the input field.",
      "params": {{
        "cssSelector": "",
        "value": ""
      }},
    }},
    {{
      "type": "locatorClick",
      "thought": "Click an element.",
      "params": {{
        "cssSelector": "",
      }},
    }},
    {{
      "type": "locatorCheck",
      "thought": "Check a checkbox or radio.",
      "params": {{
        "cssSelector": "",
      }},
    }},
    {{
      "type": "locatorInnerText",
      "thought": "Get the inner text of an element.",
      "params": {{
        "cssSelector": "",
      }},
    }}
]

## Constraints

- All the actions you composed MUST be based on the page context information you get.
- Trust the "What have been done" field about the task (if any), don't repeat actions in it.
- Respond only with valid JSON. Do not write an introduction or summary or markdown prefix like \`\`\`json\`.
      `,
          prompt: `The page html is:

====================
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }

    input {
      margin-bottom: 10px;
    }

    button {
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div>
      <label for="username">用户名</label>
      <input id="username" type="text" name="username" />
    </div>
    <div>
      <label for="password">密码</label>
      <input id="password" type="password" name="password" />
    </div>
    <div>
      <label for="remember">记住密码</label>
      <input id="remember" type="checkbox" name="remember" />
    </div>
    <button id="button" type="submit">Login</button>
    <div id="result"></div>
  </div>

  <script>
    document.getElementById('button').addEventListener('click', function() {
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      document.getElementById('result').innerHTML = "登录成功，用户名：" + username + "，密码：" + password;
    });
  </script>
</body>
</html>
====================

Please complete the following tasks:

====================
${instruction}
====================
`,
          schema: z.object({
            toolName: z.string().describe("The name of the tool."),
            args: z.object({}).optional().describe("The arguments of the tool."),
          }),
          output: "array",
        });

        return object;
      },
    );
  },
});
