export interface Address {
  id: string;
  streetName: string;
  zipCode: string;
  country: string;
  city: string;
  number: string;
}

export const exampleAddress = (): Address => ({
  id: 'KJHUIZHJK',
  streetName: 'Ungererstrasse',
  number: '110',
  zipCode: '80805',
  city: 'Munich',
  country: 'Germany',
});
