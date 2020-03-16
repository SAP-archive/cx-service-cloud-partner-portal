import { PartnerPortalPagePO } from '../pageobjects/partner-portal-page.po';

describe('workspace-project App', () => {
  let partnerPortalPage: PartnerPortalPagePO;

  beforeEach(() => {
    partnerPortalPage = new PartnerPortalPagePO();
  });

  it('Should have correct page title', async () => {
    await partnerPortalPage.navigateTo();
    await expect(partnerPortalPage.getTitleText()).toEqual('Partner Portal');
  });
});

