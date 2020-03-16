export const omit = <T>(object: T, ...keys: Array<keyof T>): Partial<T> => { // todo: once Angular is compatible with TS 3.5 we can use Omit type
  return keys.reduce(
    (previous, key) => {
      const {[key]: omitted, ...rest} = previous;
      return rest;
    },
    object
  );
};
