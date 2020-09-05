import moment from "moment";

export const getDateTimeFormat = (date) => moment(date).format(`YYYY-MM-DDTH:mm:ss`);
export const getDateFormat = (date) => moment(date).format(`YYYY-MM-DD`);
export const getTimeFormat = (date) => moment(date).format(`HH:mm`);
export const formatDateToPlaceholder = (date) => `${getDateFormat(date)} ${getTimeFormat(date)}`;
export const getFormatedDate = (date) => moment(date).format(`D MMM`);

export const getTimeOfTrip = (d1, d2) => {
  const {days, hours, minutes} = getTripDuaration(d1, d2)._data;
  return (
    `${isDate(days, `D`)}
     ${isDate(hours, `H`)}
     ${isDate(minutes, `M`)}`
  );
};

const isDate = (date, dateName) => {
  if (!date) {
    return ``;
  }
  return `${date}${dateName}`;
};

const getTripDuaration = (d1, d2) => moment.duration(moment(d2).diff(d1));

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

export const sortDate = (d1, d2) => {
  const t1 = getTripDuaration(d1.start, d1.end)._milliseconds;
  const t2 = getTripDuaration(d2.start, d2.end)._milliseconds;
  return t2 - t1;
};

