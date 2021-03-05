import { isRunningOnProdCluster } from './is-running-on-prod-cluster';
import { EmbeddedConfig, getEmbeddedConfig } from '../../environments/embedded-config';
import { changeEmbeddedConfig, setClusterName } from './embedded-config-utils.spec';

describe('isRunningOnProdCluster()', () => {
  let originalConfig: EmbeddedConfig;

  beforeEach(() => originalConfig = {...getEmbeddedConfig()});

  afterEach(() => changeEmbeddedConfig(originalConfig));

  it('should return true for prod clusters', () => {
    setClusterName('US');
    expect(isRunningOnProdCluster()).toBeTrue();

    setClusterName('DE');
    expect(isRunningOnProdCluster()).toBeTrue();

    setClusterName('IE');
    expect(isRunningOnProdCluster()).toBeTrue();

    setClusterName('AU');
    expect(isRunningOnProdCluster()).toBeTrue();

    setClusterName('CN');
    expect(isRunningOnProdCluster()).toBeTrue();

    setClusterName('cn');
    expect(isRunningOnProdCluster()).toBeTrue();

    setClusterName('Cn');
    expect(isRunningOnProdCluster()).toBeTrue();
  });

  it('should return false for other clusters', () => {
    expect(isRunningOnProdCluster()).toBeFalse();

    setClusterName('ET');
    expect(isRunningOnProdCluster()).toBeFalse();

    setClusterName('QT');
    expect(isRunningOnProdCluster()).toBeFalse();

    setClusterName('DT');
    expect(isRunningOnProdCluster()).toBeFalse();

    setClusterName('SB');
    expect(isRunningOnProdCluster()).toBeFalse();

    setClusterName('UT');
    expect(isRunningOnProdCluster()).toBeFalse();

    setClusterName('Whatever');
    expect(isRunningOnProdCluster()).toBeFalse();
  });
});
