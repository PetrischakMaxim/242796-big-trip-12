import {FilterType} from "../const";
import {isPastPoint, isFuturePoint} from "../utils/date-utils.js";

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuturePoint(point.tripDates.start)),
  [FilterType.PAST]: (points) => points.filter((point) => isPastPoint(point.tripDates.start)),
};
