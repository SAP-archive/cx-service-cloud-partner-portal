const getNewTestServerPortClosure = () => {
  let currentPort = 3001;
  return () => currentPort++;
};

export const getNewTestServerPort = getNewTestServerPortClosure();
