import {getFormatedDate} from '../../utils/utils.js';

export const createRoutesInfo = (routes) => {
  const startRoute = routes[0].destination;
  const middleRoute = routes[Math.floor(routes.length) / 2].destination;
  const endRoute = routes[routes.length - 1].destination;
  const startDate = getFormatedDate(routes[1].tripDates.start);
  const endDate = getFormatedDate(routes[routes.length - 1].tripDates.end);
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
