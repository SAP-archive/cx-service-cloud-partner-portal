import * as launchDarklyLibrary from 'ldclient-js';
import { Injectable, NgZone } from '@angular/core';

@Injectable({providedIn: 'root'})
export class LaunchDarklyClientService {
  private client: launchDarklyLibrary.LDClient | undefined;
  private readonly promise: Promise<any>;
  private onReady: () => void;

  constructor(private zone: NgZone) {
    this.promise = new Promise<void>((onReady) => this.onReady = onReady);
  }

  public initialize(launchdarklyKey: string, userId: string, isPreviewUser: boolean) {
    if (!this.client) {
      const ldUser: launchDarklyLibrary.LDUser = {
        key: userId,
        anonymous: !isPreviewUser,
        custom: isPreviewUser ? {groups: ['PREVIEW']} : {},
      };

      this.zone.runOutsideAngular(() => {
        this.client = launchDarklyLibrary.initialize(launchdarklyKey, ldUser);
        this.client.on('ready', () => this.onReady());
      });
    }
    return this.promise;
  }

  public canAccess(key: string, defaultValue: boolean = false): Promise<boolean> {
    return this.promise
      .then(() => this.client ? this.client.variation(key, defaultValue) : defaultValue);
  }
}
