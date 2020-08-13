import {createRoutesInfo} from "./trip-info-routes.js";
import {createTotalCostInfo} from "./trip-total-cost.js";

export const createTripInfo = (routes) => {
  return `
  <section class="trip-main__trip-info  trip-info">
    ${createRoutesInfo(routes)}
    ${createTotalCostInfo(routes)}
</section>`;
};
