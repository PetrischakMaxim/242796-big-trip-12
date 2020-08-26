import AbstractView from "../abstract.js";

import {createPointInfoTemplate} from "./trip-info-points.js";
import {createTotalCostInfoTemplate} from "./trip-total-cost.js";

const createTripInfoTempalte = (points) => {
  return `<section class="trip-main__trip-info  trip-info">
    ${createPointInfoTemplate(points)}
    ${createTotalCostInfoTemplate(points)}
</section>`;
};

export default class TripInfo extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripInfoTempalte(this._points);
  }
}
