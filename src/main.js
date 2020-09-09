import TripInfoView from "./view/info/trip-info.js";
import TabsView from "./view/tabs/tabs.js";
import StatsView from "./view/stats/stats.js";

import TripPresenter from "./presenter/trip.js";
import FilterPresenter from "./presenter/filter.js";
import PointsModel from "./model/points.js";
import FilterModel from "./model/filter.js";

import {generatePoint} from "./mock/point.js";
import {render, remove, RenderPosition} from "./utils/dom-utils.js";
import {MenuTab} from "./const.js";
import {POINT_COUNT} from "./const.js";

const points = new Array(POINT_COUNT).fill().map(generatePoint);

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
      statsView = new StatsView();
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


