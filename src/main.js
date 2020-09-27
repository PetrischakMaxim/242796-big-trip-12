import Api from "./api/api.js";

import {PointsModel, FilterModel} from "./model/index.js";
import {TabsView, NewPointBtnView, StatsView} from "./view/index.js";
import {TripPresenter, FilterPresenter, InfoPresenter} from "./presenter/index.js";

import {render, remove, RenderPosition} from "./utils/dom-utils.js";
import {
  MenuTab,
  UpdateType,
  AUTHORIZATION,
  END_POINT
} from "./const.js";

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
const infoPresenter = new InfoPresenter(mainInfoElement, pointsModel, filterModel);


render(mainInfoElement, newPointBtnView);

const pointBtnClickHandler = () => {
  newPointBtnView.toggleButtonState();
  tripPresenter.createPoint(() => {
    newPointBtnView.toggleButtonState(false);
  });
};

let statsView = null;
const handleTabClick = (tab) => {
  switch (tab) {
    case MenuTab.TABLE:
      tripPresenter.init();
      newPointBtnView.toggleButtonState(false);
      remove(statsView);
      break;
    case MenuTab.STATS:
      tripPresenter.destroy();
      newPointBtnView.toggleButtonState(true);
      statsView = new StatsView(pointsModel.getPoints());
      render(mainContainerElement, statsView.getElement());
      break;
  }
};


newPointBtnView.toggleButtonState();
newPointBtnView.setClickHandler(pointBtnClickHandler);

filterPresenter.init();
tripPresenter.init();

api.getPoints()
  .then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);
    infoPresenter.init();
    render(infoContainerElement, tabsView, RenderPosition.AFTERBEGIN);
    tabsView.setTabClickHandler(handleTabClick);
    newPointBtnView.toggleButtonState(false);
  });


