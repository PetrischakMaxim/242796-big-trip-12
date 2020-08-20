export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomIndex = (array) => array[getRandomInteger(0, array.length - 1)];

export const getDateTimeFormat = (date) => date.toJSON().split(`T`)[0];

export const formatDateToPlaceholder = (date) => `${getDateTimeFormat(date).split(`-`).reverse().join(`/`).slice(0, -2)}`;

export const getDateAndTimeFormat = (date) => date.toJSON().split(`.`)[0];

export const getTimeFormat = (date) => getDateAndTimeFormat(date).split(`T`)[1].slice(0, -3);

export const getFormatedDate = (date) => date.toLocaleString(`en-US`, {month: `short`, day: `numeric`});

export const getTimeOfTrip = (d1, d2) => {
  let diff = (d2.getTime() - d1.getTime()) / 1000;
  diff /= (60 * 60);
  return Math.abs(Math.round(diff)) + `H`;
};


export const sortPrice = (min, max) => (max.cost - min.cost);

export const sortDate = (d1, d2) => (d2.tripDates.start.getTime() - d1.tripDates.start.getTime());
