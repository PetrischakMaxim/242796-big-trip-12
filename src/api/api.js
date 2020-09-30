import TripModel from "../model/trip/trip.js";

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`,
};

const HTTP_STATUS_RANGE = {
  MIN: 200,
  MAX: 299
};

const Url = {
  POINTS: `points`,
  DESTINATIONS: `destinations`,
  OFFERS: `offers`,
  SYNC: `points/sync`,
};

const HEADER = {"Content-Type": `application/json`};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({url: Url.POINTS})
      .then(Api.toJSON)
      .then((points) => points.map(TripModel.adaptPointToClient));
  }

  getDestinations() {
    return this._load({url: Url.DESTINATIONS})
      .then(Api.toJSON);
  }

  getOffers() {
    return this._load({url: Url.OFFERS})
      .then(Api.toJSON)
      .then((offers) => {
        return TripModel.adaptOffersToClient(offers);
      });
  }

  updatePoint(point) {
    return this._load({
      url: `${Url.POINTS}/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(TripModel.adaptPointToServer(point)),
      headers: new Headers(HEADER)
    })
    .then(Api.toJSON)
    .then(TripModel.adaptPointToClient);
  }

  addPoint(point) {
    return this._load({
      url: Url.POINTS,
      method: Method.POST,
      body: JSON.stringify(TripModel.adaptPointToServer(point)),
      headers: new Headers(HEADER)
    })
      .then(Api.toJSON)
      .then(TripModel.adaptPointToClient);
  }

  deletePoint(point) {
    return this._load({
      url: `${Url.POINTS}/${point.id}`,
      method: Method.DELETE
    });
  }

  sync(data) {
    return this._load({
      url: Url.SYNC,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers(HEADER)
    })
      .then(Api.toJSON);
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(
        `${this._endPoint}/${url}`,
        {method, body, headers}
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < HTTP_STATUS_RANGE.MIN &&
      response.status > HTTP_STATUS_RANGE.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(error) {
    throw error;
  }
}
