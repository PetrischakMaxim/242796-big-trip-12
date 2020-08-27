import {getFormatedDate, getRandomIndex} from '../../utils/utils.js';
import {BLANK_POINT} from '../../const.js';

export const createPointInfoTemplate = (points) => {
  let startPoint;
  let middlePoint;
  let finalPoint;
  let startDate;
  let endDate;

  if (points.length === 0) {
    points = BLANK_POINT;
    startPoint = points.destination;
    middlePoint = ``;
    finalPoint = ``;
    startDate = getFormatedDate(points.tripDates.start);
    endDate = getFormatedDate(points.tripDates.end);
  } else {
    startPoint = points[0].destination;
    middlePoint = getRandomIndex(points).destination;
    finalPoint = points[points.length - 1].destination;
    startDate = getFormatedDate(points[0].tripDates.start);
    endDate = getFormatedDate(points[points.length - 1].tripDates.end);
  }


  return `
  <div class="trip-info__main">
    <h1 class="trip-info__title">
      ${startPoint} — ${middlePoint} — ${finalPoint}
    </h1>
    <p class="trip-info__dates">
      ${startDate}&nbsp;—&nbsp;${endDate}
    </p>
  </div>`;
};
