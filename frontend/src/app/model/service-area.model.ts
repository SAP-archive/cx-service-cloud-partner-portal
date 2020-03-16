export interface ServiceArea {
  googlePlaceId?: string;
  radius: {
    value: number,
    unit: 'km' | 'mi'
  };
  latitude: number;
  longitude: number;
}

export const emptyServiceArea = (): ServiceArea => ({
  googlePlaceId: '',
  latitude: 0,
  longitude: 0,
  radius: {
    unit: 'km',
    value: 0,
  },
});

export const exampleServiceArea = (): ServiceArea => ({
  googlePlaceId: 'fsdg32jkfdg',
  latitude: 14545454,
  longitude: 4544523,
  radius: {
    unit: 'km',
    value: 20,
  },
});
