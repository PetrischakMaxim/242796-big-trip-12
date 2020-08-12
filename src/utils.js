export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomIndex = (array) => array[getRandomInteger(0, array.length - 1)];

export const getDateTimeFormat = (date) => date.toJSON().split(`T`)[0];

export const getDateAndTimeFormat = (date) => date.toJSON().split(`.`)[0];

export const getTimeFormat = (date) => `${date.getHours()}:${date.getMinutes()}`;

export const getFormatedDate = (date) => date.toLocaleString(`en-US`, {month: `short`, day: `numeric`});
