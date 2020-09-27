export const sortByPrice = (min, max) => (max.price - min.price);

export const isEscKeyPressed = (evt) => {
  return (evt.key === `Escape` || evt.key === `Esc`) ? true : false;
};

export const changeString = (str) => `${str[0].toUpperCase()}${str.slice(1)}`;

