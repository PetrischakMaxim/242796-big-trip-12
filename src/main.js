import TripInfoView from "./view/info/trip-info.js";
import TabsView from "./view/tabs/tabs.js";
import StatsView from "./view/stats/stats.js";
import Api from "./api/api.js";

import TripPresenter from "./presenter/trip.js";
import FilterPresenter from "./presenter/filter.js";
import PointsModel from "./model/points.js";
import FilterModel from "./model/filter.js";

import {render, remove, RenderPosition} from "./utils/dom-utils.js";
import {MenuTab, UpdateType} from "./const.js";

const AUTHORIZATION = `Basic eo0w590ik291305`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;

const api = new Api(END_POINT, AUTHORIZATION);

const mainInfoElement = document.querySelector(`.trip-main`);
const infoContainerElement = mainInfoElement.querySelector(`.trip-controls`);
const mainElement = document.querySelector(`.page-main`);
const mainContainerElement = mainElement.querySelector(
    `.page-body__container`
);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const tabsView = new TabsView();

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


const pointNewButton = mainInfoElement.querySelector(`.trip-main__event-add-btn`);

pointNewButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint(toggleButtonState);
  toggleButtonState(true);
});

const toggleButtonState = (flag = false) => {
  pointNewButton.disabled = flag;
};

filterPresenter.init();
tripPresenter.init();

api.getPoints()
  .then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);

    render(infoContainerElement, tabsView, RenderPosition.AFTERBEGIN);
    render(mainInfoElement, new TripInfoView(pointsModel.getPoints()), RenderPosition.AFTERBEGIN);
    tabsView.setTabClickHandler(handleTabClick);
  });
// .catch(()=> {
//   pointsModel.setPoints(UpdateType.INIT, []);
//   render(infoContainerElement, tabsView, RenderPosition.AFTERBEGIN);
//   render(mainInfoElement, new TripInfoView(pointsModel.getPoints()), RenderPosition.AFTERBEGIN);
//   tabsView.setTabClickHandler(handleTabClick);
// });


