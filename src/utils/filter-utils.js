import {FilterType} from "../const.js";
import {isPastPoint, isFuturePoint} from "../utils/date-utils.js";

export const filter = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuturePoint(point.start)),
  [FilterType.PAST]: (points) => points.filter((point) => isPastPoint(point.start)),
};

