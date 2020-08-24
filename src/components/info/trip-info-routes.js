import {getFormatedDate, getRandomIndex} from '../../utils/utils.js';
import {BLANK_ROUTE} from '../../const.js';

export const createRoutesInfo = (routes) => {
  let startRoute;
  let middleRoute;
  let endRoute;
  let startDate;
  let endDate;

  if (routes.length === 0) {
    routes = BLANK_ROUTE;
    startRoute = routes.destination;
    middleRoute = ``;
    endRoute = ``;
    startDate = getFormatedDate(routes.tripDates.start);
    endDate = getFormatedDate(routes.tripDates.end);
  } else {
    startRoute = routes[0].destination;
    middleRoute = getRandomIndex(routes).destination;
    endRoute = routes[routes.length - 1].destination;
    startDate = getFormatedDate(routes[0].tripDates.start);
    endDate = getFormatedDate(routes[routes.length - 1].tripDates.end);
  }


  return `
  <div class="trip-info__main">
    <h1 class="trip-info__title">
      ${startRoute} — ${middleRoute} — ${endRoute}
    </h1>
    <p class="trip-info__dates">
      ${startDate}&nbsp;—&nbsp;${endDate}
    </p>
  </div>`;
};
