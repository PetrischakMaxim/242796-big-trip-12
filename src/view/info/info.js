import AbstractView from "../abstract/abstract.js";
import {getFormatedDate} from '../../utils/date-utils.js';

const createPointInfoTemplate = (points) => {

  if (!points.length) {
    return ``;
  }
  const separator = (points.length > 3) ? `—...—` : `${points[1].info.name}`;
  const startPoint = points[0].info.name;
  const finalPoint = points[points.length - 1].info.name;
  const startDate = getFormatedDate(points[0].start);
  const endDate = getFormatedDate(points[points.length - 1].end);

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">
        ${startPoint}${separator}${finalPoint}
      </h1>
      <p class="trip-info__dates">${startDate}&nbsp;—&nbsp;${endDate}</p>
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
