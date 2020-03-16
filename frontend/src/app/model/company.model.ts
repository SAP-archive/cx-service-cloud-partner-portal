export interface Company {
  id: number;
  name: string;
}

export const exampleCompany = (): Company => ({
  id: 1,
  name: 'Serious Business Ltd.',
});
