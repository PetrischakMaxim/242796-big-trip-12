import InfoView from "../view/info/info.js";
import {render, RenderPosition, replace, remove} from "../utils/dom-utils.js";
import {getFormatedDate} from '../utils/date-utils.js';
import {filter} from '../utils/filter-utils.js';

export default class Info {
  constructor(container, pointsModel, filterModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;

    this._infoView = null;
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const points = this._pointsModel.getPoints();
    const filterType = this._filterModel.getFilter();
    const filteredPoints = filter[filterType](points);

    const cost = this._getTotalCost(filteredPoints);
    const title = this._getInfoTitle(filteredPoints);
    const time = this._getInfoTime(filteredPoints);

    const prevInfoView = this._infoView;

    this._infoView = new InfoView(title, time, cost);

    if (prevInfoView === null) {
      render(this._container, this._infoView, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._infoView, prevInfoView);
    remove(prevInfoView);
  }

  _getOffersCost(offers) {
    return offers.reduce((total, offer) => total + offer.price, 0);
  }

  _getTotalCost(points) {
    return points.reduce((total, point) => {
      if (point.offers.length) {
        total += this._getOffersCost(point.offers);
      }

      return total + point.price;
    }, 0);
  }

  _getInfoTitle(points) {
    const {length} = points;

    if (!length) {
      return ``;
    }

    if (length <= 3) {
      return points.map((point) => point.info.name).join(` — `);
    }

    return `${points[0].info.name} — ... — ${points[length - 1].info.name}`;
  }

  _getInfoTime(points) {
    const {length} = points;

    if (!length) {
      return ``;
    }

    return `${getFormatedDate(points[0].start)} — ${getFormatedDate(points[length - 1].end)}`;
  }

  _handleModelEvent() {
    this.init();
  }
}
