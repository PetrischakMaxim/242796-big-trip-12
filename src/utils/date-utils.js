import moment from "moment";

export const getDateTimeFormat = (date) => moment(date).format(`YYYY-MM-DDTH:mm:ss`);
export const getDateFormat = (date) => moment(date).format(`DD/MM/YY`);
export const getTimeFormat = (date) => moment(date).format(`HH:mm`);
export const formatDateToPlaceholder = (date) => `${getDateFormat(date)} ${getTimeFormat(date)}`;
export const getFormatedDate = (date) => moment(date).format(`D MMM`);

export const getTotalDuration = (d1, d2) => {
  const duration = d2 ? moment.duration(d2 - d1) : moment.duration(d1);
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();

  return `
    ${days ? isNeededZero(days) + `D ` : ``}
    ${hours ? isNeededZero(hours) + `H ` : ``}
    ${minutes !== 0 || !hours && !days ? isNeededZero(minutes) + `M` : ``}
    `;
};

export const getTimeOfTrip = (d1, d2) => {
  const {days, hours, minutes} = getTripDuration(d1, d2)._data;
  return (
    `${isDate(days, `D`)}
     ${isDate(hours, `H`)}
     ${isDate(minutes, `M`)}`
  );
};

const isNeededZero = (n) => (n < 10) ? `0${n}` : n;

const isDate = (date, dateName) => {
  if (!date) {
    return ``;
  }
  return `${isNeededZero(date)}${dateName}`;
};

export const getTripDuration = (d1, d2) => moment.duration(moment(d2).diff(d1));

export const isFuturePoint = (date) => {
  if (date === null) {
    return false;
  }
  return moment(new Date()).isBefore(date, `day`);
};

export const isPastPoint = (date) => {
  if (date === null) {
    return false;
  }
  return moment(new Date()).isAfter(date, `day`);
};

export const sortByTime = (d1, d2) => {
  const t1 = getTripDuration(d1.start, d1.end)._milliseconds;
  const t2 = getTripDuration(d2.start, d2.end)._milliseconds;
  return t2 - t1;
};

export const sortByDate = (d1, d2) => d1.start.valueOf() - d2.start.valueOf();
