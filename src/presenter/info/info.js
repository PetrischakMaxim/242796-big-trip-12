import InfoView from '../../view/info/info.js';

import {
  render,
  RenderPosition,
  replace,
  remove,
  getElement,
} from '../../utils/dom-utils';

import {
  formatDateMmmDd,
} from '../../utils/date-utils';

import {FilterType} from '../../const';
import {filter} from '../../utils/filter-utils.js';

const {
  AFTER_BEGIN,
} = RenderPosition;

const DESTINATION_COUNT = 3;

const getPeriodTitle = (date) => formatDateMmmDd(date).toLocaleUpperCase();

const calcOffersCost = (offers) => offers.reduce((sum, offer) => sum + offer.price, 0);

const calcCost = (points) => points.reduce((sum, point) => {
  if (point.offers.length > 0) {
    sum += calcOffersCost(point.offers);
  }
  return sum + point.price;
}, 0);

const getRoute = (points) => {
  const count = points.length;
  if (count === 0) {
    return ``;
  }

  if (count <= DESTINATION_COUNT) {
    return points.map((point) => point.destination.name).join(` — `);
  }

  return `${points[0].destination.name} — ... — ${points[count - 1].destination.name}`;
};

const getPeriod = (points) => {
  const count = points.length;
  return count > 0
    ? `${
      getPeriodTitle(points[0].start)
    } — ${
      getPeriodTitle(points[count - 1].end)
    }`
    : ``;
};

export default class Info {
  constructor(infoContainer, tripModel, filterModel) {
    this._infoContainerElement = getElement(infoContainer);
    this._tripModel = tripModel;
    this._filterModel = filterModel;

    this._infoView = null;
    this._currentFilter = null;

    this._modelEventHandler = this._modelEventHandler.bind(this);

    this._tripModel.add(this._modelEventHandler);
    this._filterModel.add(this._modelEventHandler);
  }

  init() {
    const points = this._tripModel.getPoints();
    const filterType = this._filterModel.get();
    const filteredPoints = filterType === FilterType.EVERYTHING
      ? points
      : filter[filterType](points);

    const cost = calcCost(filteredPoints);
    const route = getRoute(filteredPoints);
    const period = getPeriod(filteredPoints);

    const prevInfoView = this._infoView;


    this._infoView = new InfoView(route, period, cost);

    if (prevInfoView === null) {
      render(this._infoContainerElement, this._infoView, AFTER_BEGIN);
      return;
    }

    replace(this._infoView, prevInfoView);
    remove(prevInfoView);
  }

  _modelEventHandler() {
    this.init();
  }
}
