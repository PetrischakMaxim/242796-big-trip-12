import moment from 'moment';

const isDate = (date) => date instanceof Date;

export const convertNumberOfDate = (value) => String(value).padStart(2, `0`);
/**
 * @param {date} date
 * @return {date} 17/08/20 18:00
 */
export const formatDateYyyyMmDdHhMmWithDash = (date) => isDate(date) ? moment(date).format(`DD/MM/YY HH:mm`) : ``;

/**
 * @param {date} date
 * @return {date} 2020-08-17T18:00
 */
export const formatDateISODdMmYyyyHhMm = (date) => isDate(date) ? moment(date).format(`YYYY-MM-DD[T]HH:mm`) : ``;

export const formatDateMmmDd = (date) => isDate(date) ? moment(date).format(`MMM DD`) : ``;

/**
 * @param {number} ms
 * @return {object} {days: number, hours: number, minutes: number}
 */
export const convertMsToDHM = (ms) => {
  const duration = moment.duration(ms);
  return {
    days: duration.days(),
    hours: duration.hours(),
    minutes: duration.minutes(),
  };
};

export const isDateAfter = (date1, date2) => {
  date1 = moment(date1).format(`YYYY-MM-DD`);
  date2 = moment(date2).format(`YYYY-MM-DD`);

  return moment(date1).isAfter(date2);
};

export const isDateBefore = (date1, date2) => {
  date1 = moment(date1).format(`YYYY-MM-DD`);
  date2 = moment(date2).format(`YYYY-MM-DD`);
  return moment(date1).isBefore(date2);
};

export const addDaysToDate = (date, count = 1) => new Date(moment(date).add(count, `day`).format());
