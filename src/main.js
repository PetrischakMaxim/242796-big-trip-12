import TripInfoView from "./view/info/trip-info.js";
import TabsView from "./view/tabs/tabs.js";

import TripPresenter from "./presenter/trip.js";
import FilterPresenter from "./presenter/filter.js";
import PointsModel from "./model/points.js";
import FilterModel from "./model/filter.js";

import {generatePoint} from "./mock/point.js";
import {render, RenderPosition} from "./utils/dom-utils.js";
import {POINT_COUNT} from "./const.js";

const points = new Array(POINT_COUNT).fill().map(generatePoint);


const pointsModel = new PointsModel();
pointsModel.setPoins(points);

const filterModel = new FilterModel();

const headerElement = document.querySelector(`.page-header`);
const mainInfoElement = headerElement.querySelector(`.trip-main`);
const infoContainerElement = mainInfoElement.querySelector(`.trip-controls`);

render(mainInfoElement, new TripInfoView(points), RenderPosition.AFTERBEGIN);
render(infoContainerElement, new TabsView(), RenderPosition.AFTERBEGIN);

const mainElement = document.querySelector(`.page-main`);
const mainContainerElement = mainElement.querySelector(
    `.page-body__container`
);

const tpipPresenter = new TripPresenter(mainContainerElement, pointsModel);
const filterPresenter = new FilterPresenter(infoContainerElement, filterModel, pointsModel);

filterPresenter.init();
tpipPresenter.init();
