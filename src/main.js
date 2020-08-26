import TripInfoView from "./components/info/trip-info.js";
import FilterView from "./components/filter/filter.js";
import TabsView from "./components/tabs/tabs.js";
import TripPresenter from "./presenter/trip.js";

import {generateRoute} from "./mock/route.js";
import {render, RenderPosition} from "./utils/dom-utils.js";
import {TRIP_COUNT} from "./const.js";

const routes = new Array(TRIP_COUNT).fill().map(generateRoute);

const pageHeaderElement = document.querySelector(`.page-header`);
const tripMainInfoElement = pageHeaderElement.querySelector(`.trip-main`);
const controlsWrapper = tripMainInfoElement.querySelector(`.trip-controls`);

render(tripMainInfoElement, new TripInfoView(routes), RenderPosition.AFTERBEGIN);
render(controlsWrapper, new TabsView(), RenderPosition.AFTERBEGIN);
render(controlsWrapper, new FilterView());

const pageMainElement = document.querySelector(`.page-main`);
const pageMainContainer = pageMainElement.querySelector(
    `.page-body__container`
);


new TripPresenter(pageMainContainer).init(routes, TRIP_COUNT);


