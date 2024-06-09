import * as playwright from 'playwright';
import { delay } from 'src/utils/delay';

export class PlaywrightClass {
  private browser: playwright.Browser;
  private context: playwright.BrowserContext;

  public async startBrowser(headless = true) {
    const browser = await playwright.chromium.launch({
      headless,
    });
    this.browser = browser;

    const context = await browser.newContext({
      acceptDownloads: true,
    });
    this.context = context;
  }

  public async newPage(): Promise<playwright.Page> {
    const page = await this.context.newPage();
    return page;
  }

  public async closeBrowser() {
    await delay(3000);
    if (this.browser) {
      await this.browser.close();
    }
  }
}
