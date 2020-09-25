import TripInfoView from "./view/info/info.js";
import TabsView from "./view/tabs/tabs.js";
import StatsView from "./view/stats/stats.js";
import NewPointBtnView from "./view/new-point-btn/new-point-btn.js";

import Api from "./api/api.js";

import TripPresenter from "./presenter/trip.js";
import FilterPresenter from "./presenter/filter.js";
import PointsModel from "./model/points.js";
import FilterModel from "./model/filter.js";

import {render, remove, RenderPosition} from "./utils/dom-utils.js";
import {MenuTab, UpdateType, AUTHORIZATION, END_POINT} from "./const.js";

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
const newPointBtnView = new NewPointBtnView();

const tripPresenter = new TripPresenter(mainContainerElement, pointsModel, filterModel, api);
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

render(mainInfoElement, newPointBtnView);

const pointBtnClickHandler = () => {
  newPointBtnView.toggleButtonState();
  tripPresenter.createPoint(() => {
    newPointBtnView.toggleButtonState(false);
  });
};

newPointBtnView.toggleButtonState();
newPointBtnView.setClickHandler(pointBtnClickHandler);

filterPresenter.init();
tripPresenter.init();

api.getPoints()
  .then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);
    render(infoContainerElement, tabsView, RenderPosition.AFTERBEGIN);
    render(mainInfoElement, new TripInfoView(points), RenderPosition.AFTERBEGIN);
    tabsView.setTabClickHandler(handleTabClick);
    newPointBtnView.toggleButtonState(false);
  })
  .catch(()=> {
    pointsModel.setPoints(UpdateType.INIT, []);
    render(infoContainerElement, tabsView, RenderPosition.AFTERBEGIN);
    render(mainInfoElement, new TripInfoView(pointsModel.getPoints()), RenderPosition.AFTERBEGIN);
    tabsView.setTabClickHandler(handleTabClick);
  });
