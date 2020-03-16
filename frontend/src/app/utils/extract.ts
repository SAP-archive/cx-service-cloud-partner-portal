export const extractPropertiesBasedOnOtherObject = <T>(object: T, subObj: Partial<T>): Partial<T> => {
  const res: Partial<T> = {};
  if (!!object && !!subObj) {
    Object.keys(subObj).forEach(key => {
      res[key] = object[key];
    });
  }
  return res;
};
