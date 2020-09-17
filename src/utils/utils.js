export const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomIndex = (array) => array[getRandomInteger(0, array.length - 1)];

export const sortByPrice = (min, max) => (max.price - min.price);

export const isEscKeyPressed = (evt) => {
  return (evt.key === `Escape` || evt.key === `Esc`) ? true : false;
};

export const changeString = (str) => `${str[0].toUpperCase()}${str.slice(1)}`;

