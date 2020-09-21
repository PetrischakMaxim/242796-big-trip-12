import AbstractView from "../abstract/abstract.js";
import {getFormatedDate} from '../../utils/date-utils.js';
import {BLANK_POINT} from '../../const.js';

const createPointInfoTemplate = (points) => {
  let startPoint;
  let finalPoint;
  let startDate;
  let endDate;
  const separator = (points && points.length > 3) ? `—...—` : `${points[1].info.name}`;

  if (!points || points.length === 0) {
    points = BLANK_POINT;
    startPoint = points.info.name;
    finalPoint = ``;
    startDate = getFormatedDate(points.start);
    endDate = getFormatedDate(points.end);
  } else {
    startPoint = points[0].info.name;
    finalPoint = points[points.length - 1].info.name;
    startDate = getFormatedDate(points[0].start);
    endDate = getFormatedDate(points[points.length - 1].end);
  }

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">
        ${startPoint}
        ${separator}
        ${finalPoint}
      </h1>
      <p class="trip-info__dates">
        ${startDate}&nbsp;—&nbsp;${endDate}
      </p>
    </div>`
  );
};

const createTotalCostTemplate = (points) => (
  `<p class="trip-info__cost">
    Total: €&nbsp;
    <span class="trip-info__cost-value">
      ${points.map((point)=> point.price).reduce((total, current) => total + current, 0)}
    </span>
  </p>`
);

const createTripInfoTempalte = (points) => (
  `<section class="trip-main__trip-info trip-info">
    ${createPointInfoTemplate(points)}
    ${createTotalCostTemplate(points)}
  </section>`
);

export default class TripInfo extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripInfoTempalte(this._points);
  }
}
