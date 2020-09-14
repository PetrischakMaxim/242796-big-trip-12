import TripInfoView from "./view/info/trip-info.js";
import TabsView from "./view/tabs/tabs.js";
import StatsView from "./view/stats/stats.js";
import Api from "./api/api.js";

import TripPresenter from "./presenter/trip.js";
import FilterPresenter from "./presenter/filter.js";
import PointsModel from "./model/points.js";
import FilterModel from "./model/filter.js";

import {generatePoint} from "./mock/point.js";
import {render, remove, RenderPosition} from "./utils/dom-utils.js";
import {MenuTab} from "./const.js";
import {POINT_COUNT} from "./const.js";

const AUTHORIZATION = `Basic eo0w590ik291305`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;


const points = new Array(POINT_COUNT).fill().map(generatePoint);

const api = new Api(END_POINT, AUTHORIZATION);

api.getPoints().then((points) => {
  console.log(points[0]);
});

console.log(points[0]);

const pointsModel = new PointsModel();
pointsModel.setPoins(points);

const filterModel = new FilterModel();
const tabsView = new TabsView();
const headerElement = document.querySelector(`.page-header`);
const mainInfoElement = headerElement.querySelector(`.trip-main`);
const infoContainerElement = mainInfoElement.querySelector(`.trip-controls`);

render(mainInfoElement, new TripInfoView(points), RenderPosition.AFTERBEGIN);
render(infoContainerElement, tabsView, RenderPosition.AFTERBEGIN);

const mainElement = document.querySelector(`.page-main`);
const mainContainerElement = mainElement.querySelector(
    `.page-body__container`
);

const tripPresenter = new TripPresenter(mainContainerElement, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(infoContainerElement, filterModel, pointsModel);

let statsView = null;
const handleTabClick = (tab) => {
  switch (tab) {
    case MenuTab.TABLE:
      tripPresenter.init();
      remove(statsView);
      break;
    case MenuTab.STATS:
      tripPresenter.destroy();
      statsView = new StatsView(pointsModel.getPoints());
      render(mainContainerElement, statsView.getElement());
      break;
  }
};

tabsView.setTabClickHandler(handleTabClick);

filterPresenter.init();
tripPresenter.init();

const pointNewButton = headerElement.querySelector(`.trip-main__event-add-btn`);

pointNewButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint(toggleButtonState);
  toggleButtonState(true);
});

const toggleButtonState = (flag = false) => {
  pointNewButton.disabled = flag;
};


