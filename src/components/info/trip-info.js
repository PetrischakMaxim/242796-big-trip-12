import AbstractView from "../abstract.js";
import {createRoutesInfo} from "./trip-info-routes.js";
import {createTotalCostInfo} from "./trip-total-cost.js";

const createTripInfoTempalte = (routes) => {
  return `<section class="trip-main__trip-info  trip-info">
    ${createRoutesInfo(routes)}
    ${createTotalCostInfo(routes)}
</section>`;
};

export default class TripInfo extends AbstractView {
  constructor(routes) {
    super();
    this._routes = routes;
  }

  getTemplate() {
    return createTripInfoTempalte(this._routes);
  }
}
