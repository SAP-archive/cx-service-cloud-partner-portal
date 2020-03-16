import { browser } from 'protractor';
import { ITestContext } from '../model/itestcontext';

export class TestContext {
    private static testContextObject: ITestContext;

    public static getTestContext(): ITestContext {
        if (TestContext.testContextObject === undefined || TestContext.testContextObject === null) {
        const envToUse = browser.params.useEnv;
        TestContext.testContextObject = browser.params.envs.config[envToUse];
        return TestContext.testContextObject;
        }
        return TestContext.testContextObject;
    }
}
