export interface UnifiedPerson {
  personStatus?: string;
  firstName: string;
  lastName: string;
  inactive: boolean;
  id: string;
}

export const examplePerson = (): UnifiedPerson => {
  return {
    id: '6544897432132154',
    firstName: 'John',
    lastName: 'Doe',
    inactive: false,
  };
};
