import ControlsView from "./view/controls/controls.js";
import TabsView from "./view/tabs/tabs.js";
import NewPointButtonView from "./view/new-point-button/new-point-button.js";

import TripPresenter from "./presenter/trip/trip.js";
import FilterPresenter from "./presenter/filter/filter.js";
import InfoPresenter from "./presenter/info/info.js";
import StatsPresenter from "./presenter/stats/stats.js";

import TripModel from "./model/trip/trip.js";
import FilterModel from "./model/filter/filter.js";

import {RenderPosition, render} from './utils/dom-utils.js';
import {TabItem, UpdateType} from './const.js';

import Provider from './api/provider.js';
import Store from './api/store.js';
import Api from './api/api.js';

const AUTHORIZATION = `Basic RegregkjHhfre342`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;
const STORE_PREFIX = `big-trip`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const tripModel = new TripModel();
const filterModel = new FilterModel();

const tripMainElement = document.querySelector(`.trip-main`);

const controlsView = new ControlsView();
render(tripMainElement, controlsView);

const tabsView = new TabsView();
render(controlsView.getFilterEventsHeaderElement(), tabsView, RenderPosition.BEFORE_BEGIN);

const newPointButtonView = new NewPointButtonView();
render(tripMainElement, newPointButtonView);

const bodyContainerElement = document.querySelector(`.page-main`).querySelector(`.page-body__container`);
const tripEventsElement = bodyContainerElement.querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(tripEventsElement, tripModel, filterModel, apiWithProvider);
const filterPresenter = new FilterPresenter(controlsView, tripModel, filterModel);
const infoPresenter = new InfoPresenter(tripMainElement, tripModel, filterModel);
const statisticsPresenter = new StatsPresenter(bodyContainerElement, tripModel, filterModel);

const newPointButtonClickHandler = () => {
  newPointButtonView.setEnabled();
  tripPresenter.createPoint(() => {
    newPointButtonView.setEnabled(false);
  });
};

newPointButtonView.setEnabled(false);
newPointButtonView.setClickHandler(newPointButtonClickHandler);

const tabsClickHandler = (activeTab) => {
  statisticsPresenter.changeMode(activeTab);

  switch (activeTab) {
    case TabItem.TABLE:
      tripPresenter.init();
      statisticsPresenter.destroy();
      break;
    case TabItem.STATS:
      tripPresenter.destroy();
      statisticsPresenter.init();
      break;
  }
};

tripPresenter.init();

Promise.all([
  apiWithProvider.getDestinations(),
  apiWithProvider.getOffers(),
  apiWithProvider.getPoints()
])
  .then((values) => {
    const [destinations, offers, points] = values;

    tripModel.setDestinations(destinations);
    tripModel.setOffers(offers);
    tripModel.setPoints(UpdateType.INIT, points);

    tabsView.setClickHandler(tabsClickHandler);
    newPointButtonView.setEnabled(false);

    filterPresenter.init();
    infoPresenter.init();
  })
  .catch(() => {
    tripModel.setError(UpdateType.ERROR);
  });

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  if (apiWithProvider.isSyncRequired) {
    apiWithProvider.sync()
      .then((syncedPoints) => {
        tripModel.setPoints(UpdateType.MINOR, syncedPoints);
      });
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
