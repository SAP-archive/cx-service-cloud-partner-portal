import { v4 as uuid } from 'uuid';

export class UUIDFactory {
  public static createUUID(): string {
    return uuid().replace(/\-/g, '');
  }
}
