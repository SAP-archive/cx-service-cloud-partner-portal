import { browser } from 'protractor';
import { TestContext } from '../util/testcontext';

export class PartnerPortalPagePO {

  public async navigateTo(urfSuffix?: string): Promise<PartnerPortalPagePO> {
    let url = TestContext.getTestContext().baseUrl;
    if (urfSuffix) {
      url += urfSuffix;
    }
    await browser.get(url);
    return this;
  }

  public async getTitleText(): Promise<string> {
    return await browser.getTitle();
  }
}
