import { type Page, chromium } from "playwright";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class Simulator {
  private page: Page | null = null;
  private static instance: Simulator | null = null;

  static getInstance() {
    if (!this.instance) {
      this.instance = new Simulator();
    }
    return this.instance;
  }

  getPage() {
    return this.page!;
  }

  constructor() {
    if (!this.page) {
      this.init();
    }
  }

  async init() {
    const browser = await chromium.launch();
    this.page = await browser.newPage();
  }

  async loadPage(url: string) {
    if (this.page) {
      await this.page.goto(url);
    }
  }

  async getPageContent() {
    if (this.page) {
      return await this.page.content();
    }
  }

  async locatorFill(cssSelector: string, value: string) {
    if (this.page) {
      const element = await this.page.locator(cssSelector);
      await element.fill(value);
    }
  }

  async locatorClick(cssSelector: string) {
    if (this.page) {
      const element = await this.page.locator(cssSelector);
      await element.click();
      await delay(200);
    }
  }

  async locatorCheck(cssSelector: string) {
    if (this.page) {
      const element = await this.page.locator(cssSelector);
      await element.check();
    }
  }

  async locatorInnerText(cssSelector: string) {
    if (this.page) {
      const element = await this.page.locator(cssSelector);
      return await element.innerText();
    }
  }

  async screenshot() {
    if (this.page) {
      const buffer = await this.page.screenshot({ type: "png" });
      const dataURL = `data:image/png;base64,${buffer.toString("base64")}`;
      return dataURL;
    }
  }
}
