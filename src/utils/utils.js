import {convertNumberOfDate, convertMsToDHM} from './date-utils';

const Key = {
  ESCAPE: `Escape`,
  ESC: `Esc`,
};

export const capitalizeString = (str) => `${str[0].toUpperCase()}${str.slice(1)}`;
export const extend = (a, ...b) => Object.assign({}, a, ...b);
export const isEscPressed = (evt) => evt.key === Key.ESCAPE || evt.key === Key.ESC;

export const convertDurationValue = (duration) => {
  duration = convertMsToDHM(duration);
  const {days, hours, minutes} = duration;
  if (days > 0) {
    return `${convertNumberOfDate(days)}D ${convertNumberOfDate(hours)}H ${convertNumberOfDate(minutes)}M`;
  }

  return `${hours > 0 ? `${convertNumberOfDate(hours)}H` : ``} ${convertNumberOfDate(minutes)}M`;
};
