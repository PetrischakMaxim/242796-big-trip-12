export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomIndex = (array) => array[getRandomInteger(0, array.length - 1)];

export const getDateTimeFormat = (date) => date.toJSON().substring(0, 10).replace(`T`, ` `);

export const getFormatedDate = (date) => date.toLocaleString(`en-US`, {month: `short`, day: `numeric`});
