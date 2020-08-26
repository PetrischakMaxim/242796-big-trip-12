import TripInfoView from "./components/info/trip-info.js";
import FilterView from "./components/filter/filter.js";
import TabsView from "./components/tabs/tabs.js";
import TripPresenter from "./presenter/trip.js";

import {generatePoint} from "./mock/point.js";
import {render, RenderPosition} from "./utils/dom-utils.js";
import {POINT_COUNT} from "./const.js";

const points = new Array(POINT_COUNT).fill().map(generatePoint);

const headerElement = document.querySelector(`.page-header`);
const mainInfoElement = headerElement.querySelector(`.trip-main`);
const infoContainerElement = mainInfoElement.querySelector(`.trip-controls`);

render(mainInfoElement, new TripInfoView(points), RenderPosition.AFTERBEGIN);
render(infoContainerElement, new TabsView(), RenderPosition.AFTERBEGIN);
render(infoContainerElement, new FilterView());

const mainElement = document.querySelector(`.page-main`);
const mainContainerElement = mainElement.querySelector(
    `.page-body__container`
);

new TripPresenter(mainContainerElement).init(points, POINT_COUNT);


