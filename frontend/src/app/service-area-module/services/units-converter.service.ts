export class UnitsConverterService {
  private static readonly oneMileInMeters = 1609.344;
  private static readonly oneKilometerInMeters = 1000;

  public static milesToMeters(miles: number): number {
    return miles * UnitsConverterService.oneMileInMeters;
  }

  public static kilometersToMeters(kilometers: number): number {
    return kilometers * UnitsConverterService.oneKilometerInMeters;
  }
}
