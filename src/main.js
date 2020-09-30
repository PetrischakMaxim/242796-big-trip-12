import Api from "./api/api.js";

import FilterModel from "./model/filter.js";
import PointsModel from "./model/points.js";

import TabsView from "./view/tabs/tabs.js";
import NewPointBtnView from "./view/new-point-btn/new-point-btn.js";
import StatsView from "./view/stats/stats.js";

import TripPresenter from "./presenter/trip.js";
import FilterPresenter from "./presenter/filter.js";
import InfoPresenter from "./presenter/info.js";

import {render, remove, RenderPosition} from "./utils/dom-utils.js";
import {MenuTab, UpdateType} from "./const.js";

const AUTHORIZATION = `Basic eo0w590ik21305`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;

const api = new Api(END_POINT, AUTHORIZATION);

const mainInfoElement = document.querySelector(`.trip-main`);
const infoContainerElement = mainInfoElement.querySelector(`.trip-controls`);
const mainElement = document.querySelector(`.page-main`);
const mainContainerElement = mainElement.querySelector(`.page-body__container`);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const tabsView = new TabsView();
const newPointBtnView = new NewPointBtnView();

const tripPresenter = new TripPresenter(
    mainContainerElement,
    pointsModel,
    filterModel,
    api
);

const filterPresenter = new FilterPresenter(
    infoContainerElement,
    filterModel,
    pointsModel
);

const infoPresenter = new InfoPresenter(
    mainInfoElement,
    pointsModel,
    filterModel
);

render(mainInfoElement, newPointBtnView);

const pointBtnClickHandler = () => {
  newPointBtnView.setEnabled();
  tripPresenter.createPoint(() => {
    newPointBtnView.setEnabled(false);
  });
};

let statsView = null;
const handleTabClick = (tab) => {
  switch (tab) {
    case MenuTab.TABLE:
      tripPresenter.init();
      newPointBtnView.setEnabled(false);
      remove(statsView);
      break;
    case MenuTab.STATS:
      tripPresenter.destroy();
      newPointBtnView.setEnabled(true);
      statsView = new StatsView(pointsModel.getPoints());
      render(mainContainerElement, statsView.getElement());
      break;
  }
};

newPointBtnView.setEnabled();
newPointBtnView.setClickHandler(pointBtnClickHandler);

tripPresenter.init();

Promise.all([
  api.getDestinations(),
  api.getOffers(),
  api.getPoints()
]).then((values) => {
  const [destinations, offers, points] = values;
  pointsModel.setDestinations(destinations);
  pointsModel.setOffers(offers);
  pointsModel.setPoints(UpdateType.INIT, points);


  filterPresenter.init();
  infoPresenter.init();
  render(infoContainerElement, tabsView, RenderPosition.AFTERBEGIN);
  tabsView.setTabClickHandler(handleTabClick);
  newPointBtnView.setEnabled(false);
});


// .catch((e) => {
//   console.log(e);
//   pointsModel.setError(UpdateType.ERROR);
// });


