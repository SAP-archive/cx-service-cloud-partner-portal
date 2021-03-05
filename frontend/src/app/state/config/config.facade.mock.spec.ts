import { ConfigFacade } from './config.facade';

export class ConfigFacadeMockBuilder {
  private mock = jasmine.createSpyObj<ConfigFacade>([
    'fetchCompanySettingsIfNotLoadedYet',
  ]);

  public setAllowAssignmentHandover(allowAssignmentHandover: any) {
    this.mock.allowAssignmentHandover = allowAssignmentHandover;
    return this;
  }

  public setAllowAssignmentReject(allowAssignmentReject: any) {
    this.mock.allowAssignmentReject = allowAssignmentReject;
    return this;
  }

  public setAllowAssignmentClose(allowAssignmentClose: any) {
    this.mock.allowAssignmentClose = allowAssignmentClose;
    return this;
  }

  public setSelectAreCompanySettingsLoaded(selectAreCompanySettingsLoaded: any) {
    this.mock.selectAreCompanySettingsLoaded = selectAreCompanySettingsLoaded;
    return this;
  }

  public build(): jasmine.SpyObj<ConfigFacade> {
    return this.mock;
  }
}
