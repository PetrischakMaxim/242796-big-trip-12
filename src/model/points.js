import Observer from "../utils/observer.js";

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(updateType, points) {
    this._points = [...points];
    this._notify(updateType);
  }

  getPoints() {
    return this._points;
  }

  updatePoint(updateType, update) {
    const index = this._getPointIndex(this._points, update);

    if (index === -1) {
      throw new Error(`Can't update unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [update, ...this._points];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._getPointIndex(this._points, update);

    if (index === -1) {
      throw new Error(`Can't delete unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptToClient(point) {
    return {
      id: point.id,
      waypoint: point.type,
      start: new Date(point.date_from),
      end: new Date(point.date_to),
      info: point.destination,
      price: point.base_price,
      offers: point.offers,
      isFavorite: point.is_favorite,
    };
  }

  static adaptPointToServer(point) {
    return {
      "id": point.id,
      "type": point.waypoint.toLowerCase(),
      "date_from": String(point.start),
      "date_to": String(point.end),
      "destination": point.info,
      "base_price": point.price,
      "offers": point.offers,
      "is_favorite": point.isFavorite,
    };
  }

  _getPointIndex(points, update) {
    return points.findIndex((point) => point.id === update.id);
  }

}
