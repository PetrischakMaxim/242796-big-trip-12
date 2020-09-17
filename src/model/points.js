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
    const index = this._points.findIndex((point) => point.id === update.id);

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
    const index = this._points.findIndex((point) => point.id === update.id);

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
    const adaptedPoint = Object.assign(
        {}, point,
        {
          id: Number(point.id),
          price: point.base_price,
          start: new Date(point.date_from),
          end: new Date(point.date_to),
          isFavorite: point.is_favorite,
          info: {
            name: point.destination.name,
            description: point.destination.description,
            images: point.destination.pictures,
          },
          waypoint: point.type,
          offers: point.offers,
        }
    );

    delete adaptedPoint.is_favorite;
    delete adaptedPoint.date_to;
    delete adaptedPoint.date_from;
    delete adaptedPoint.base_price;
    delete adaptedPoint.destination;
    delete adaptedPoint.type;

    return adaptedPoint;
  }

  static adaptPointToServer(point) {
    return {
      "id": String(point.id),
      "type": point.waypoint,
      "base_price": point.price,
      "date_from": String(point.start),
      "date_to": String(point.end),
      "destination": point.info,
      "is_favorite": point.isFavorite,
      "offers": point.offers,
    };
  }

}
