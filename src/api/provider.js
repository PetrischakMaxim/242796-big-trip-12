import {nanoid} from 'nanoid';
import {extend} from '../utils/utils';
import TripModel from "../model/trip/trip.js";

const getSyncedPoints = (items) => {
  return items.filter(({success}) => success)
     .map(({payload}) => payload.point);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return extend(acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSyncRequired = false;
  }

  get isSyncRequired() {
    return this._isSyncRequired;
  }

  set isSyncRequired(value) {
    this._isSyncRequired = value;
    this._store.setSyncFlag(value);
  }

  getDestinations() {
    if (this._isOnline()) {
      return this._api.getDestinations()
         .then((destinations) => {
           this._store.setDestinations(destinations);
           return destinations;
         });
    }

    const storeDestinations = this._store.getDestinations();

    return Promise.resolve(storeDestinations);
  }

  getOffers() {
    if (this._isOnline()) {
      return this._api.getOffers()
         .then((offers) => {
           this._store.setOffers(TripModel.adaptOffersToServer(offers));
           return offers;
         });
    }

    const storeOffers = Object.values(this._store.getOffers());

    return Promise.resolve(storeOffers);
  }

  getPoints() {
    if (this._isOnline()) {
      return this._api.getPoints()
         .then((points) => {
           const items = createStoreStructure(points.map(TripModel.adaptPointToServer));
           this._store.setPoints(items);
           return points;
         });
    }

    const storePoints = Object.values(this._store.getPoints());

    return Promise.resolve(storePoints.map(TripModel.adaptPointToClient));
  }

  updatePoint(point) {
    if (this._isOnline()) {
      return this._api.updatePoint(point)
        .then((updatedPoint) => {
          this._store.setPoint(updatedPoint.id, TripModel.adaptPointToServer(updatedPoint));
          return updatedPoint;
        });
    }

    this._store.setPoint(point.id, TripModel.adaptPointToServer(extend(point)));
    this.isSyncRequired = true;

    return Promise.resolve(point);
  }

  addPoint(point) {
    if (this._isOnline()) {
      return this._api.addPoint(point)
         .then((newPoint) => {
           this._store.setPoint(newPoint.id, TripModel.adaptPointToServer(newPoint));
           return newPoint;
         });
    }

    const localNewPointId = nanoid();
    const localNewPoint = extend(point, {id: localNewPointId});

    this._store.setPoint(localNewPoint.id, TripModel.adaptPointToServer(localNewPoint));
    this.isSyncRequired = true;

    return Promise.resolve(localNewPoint);
  }

  deletePoint(point) {
    if (this._isOnline()) {
      return this._api.deletePoint(point)
        .then(() => this._store.removePoint(point.id));
    }

    this._store.removePoint(point.id);
    this.isSyncRequired = true;

    return Promise.resolve();
  }

  sync() {
    if (this._isOnline()) {
      const storePoints = Object.values(this._store.getPoints());

      return this._api.sync(storePoints)
        .then((response) => {
          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);
          const items = createStoreStructure([...createdPoints, ...updatedPoints]);
          this.isSyncRequired = true;
          this._store.getPoints(items);

          return Object.values(items);
        })
        .then((points) => points.map(TripModel.adaptPointToClient));
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
