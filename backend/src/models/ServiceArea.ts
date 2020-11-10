import { SchemaWithReferences } from '../types/SchemaWithReferences';

export interface ServiceArea {
  id?: string;
  googlePlaceId?: string;
  radius: {
    value: number,
    unit: 'km' | 'mi'
  };
  latitude: number;
  longitude: number;
}

export const exampleServiceArea = (): ServiceArea => ({
  googlePlaceId: 'fsdg32jkfdg',
  latitude: 14545454,
  longitude: 4544523,
  radius: {
    unit: 'km',
    value: 20,
  },
});

export const emptyServiceArea = (): ServiceArea => ({
  googlePlaceId: '',
  latitude: 0,
  longitude: 0,
  radius: {
    unit: 'km',
    value: 0,
  },
});

export const serviceAreaSchema: SchemaWithReferences = {
  schema: {
    id: '/ServiceArea',
    type: 'object',
    additionalProperties: true,
    properties: {
      googlePlaceId: {type: ['string', 'null']},
      latitude: {type: ['number', 'null']},
      longitude: {type: ['number', 'null']},
      radius: {
        type: 'object',
        additionalProperties: true,
        properties: {
          value: { type: ['number', 'null'] },
          unit: {enum: ['km', 'mi']},
        },
        required: ['unit', 'value'],
      },
    },
  },
};
