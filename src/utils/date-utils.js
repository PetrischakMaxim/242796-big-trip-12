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

const getTripDuaration = (d1, d2) =>moment.duration(moment(d2).diff(d1));
