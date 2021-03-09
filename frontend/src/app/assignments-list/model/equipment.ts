export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
}

export const exampleEquipment = (id = 'equipment_1'): Equipment => ({
  id,
  name: 'Equipment 1',
  serialNumber: 'eq1',
});

export const emptyEquipment = (): Equipment => ({
  id: '',
  name: '',
  serialNumber: '',
});
