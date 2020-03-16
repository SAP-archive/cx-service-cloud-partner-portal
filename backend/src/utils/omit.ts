export const omit = <T>(object: T, ...keys: Array<keyof T>): Omit<T, keyof T> => {
  return keys.reduce(
    (previous, key) => {
      const {[key]: omitted, ...rest} = previous;
      return rest;
    },
    object
  );
};
