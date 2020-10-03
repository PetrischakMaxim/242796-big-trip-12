import {FilterType} from "../const.js";
import {isDateAfter, isDateBefore} from './date-utils.js';

export const filter = {
  [FilterType.FUTURE]: (points) => points.filter((point) => isDateAfter(point.start, new Date())),
  [FilterType.PAST]: (points) => points.filter((point) => isDateBefore(point.end, new Date())),
};
