import TripInfoView from "./view/info/trip-info.js";
import FilterView from "./view/filter/filter.js";
import TabsView from "./view/tabs/tabs.js";
import TripPresenter from "./presenter/trip.js";
import PointsModel from "./model/points.js";
import FilterModel from "./model/filter.js";

import {generatePoint} from "./mock/point.js";
import {render, RenderPosition} from "./utils/dom-utils.js";
import {POINT_COUNT} from "./const.js";

const points = new Array(POINT_COUNT).fill().map(generatePoint);

const filters = [
  {
    type: `everything`,
    name: `EVERYTHING`,
  }
];


const pointsModel = new PointsModel();
pointsModel.setPoins(points);

const filterModel = new FilterModel();

const headerElement = document.querySelector(`.page-header`);
const mainInfoElement = headerElement.querySelector(`.trip-main`);
const infoContainerElement = mainInfoElement.querySelector(`.trip-controls`);

render(mainInfoElement, new TripInfoView(points), RenderPosition.AFTERBEGIN);
render(infoContainerElement, new TabsView(), RenderPosition.AFTERBEGIN);
render(infoContainerElement, new FilterView(filters, `everything`));

const mainElement = document.querySelector(`.page-main`);
const mainContainerElement = mainElement.querySelector(
    `.page-body__container`
);

new TripPresenter(mainContainerElement, pointsModel).init();


