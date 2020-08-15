import {createElement} from "../../utils.js";
import {createRoutesInfo} from "./trip-info-routes.js";
import {createTotalCostInfo} from "./trip-total-cost.js";

const createTripInfoTempalte = (routes) => {
  return `<section class="trip-main__trip-info  trip-info">
    ${createRoutesInfo(routes)}
    ${createTotalCostInfo(routes)}
</section>`;
};

export default class TripInfo {
  constructor(routes) {
    this._routes = routes;
    this._element = null;
  }

  getTemplate() {
    return createTripInfoTempalte(this._routes);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
