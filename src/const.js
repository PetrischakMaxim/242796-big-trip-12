import Api from "./api/api.js";

export const AUTHORIZATION = `Basic eo0w590ik291305`;
export const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;

const api = new Api(END_POINT, AUTHORIZATION);

const getDestinations = () => {
  let result = [];
  api.getDestinations()
  .then((desctination) =>
    desctination.forEach((desct) => result.push(desct)));
  return result;
};

const getOffers = () => {
  let result = [];
  api.getOffers()
  .then((offers) =>
    offers.forEach((offer) => result.push(offer)));
  return result;
};

export const DESTINATIONS = getDestinations();
export const OFFERS = getOffers();

export const PointType = {
  TRANSFER: [
    `Taxi`,
    `Bus`,
    `Train`,
    `Ship`,
    `Transport`,
    `Drive`,
    `Flight`
  ],
  ACTIVITY: [
    `Check-in`,
    `Sightseeing`,
    `Restaurant`,
  ],
};

export const {TRANSFER, ACTIVITY} = PointType;
export const POINT_LIST = [...TRANSFER, ...ACTIVITY];

export const OFFER_LIST = [
  `Add luggage`,
  `Switch to comfort class`,
  `Add meal`,
  `Choose seats`
];

export const BLANK_POINT = {
  "id": 135989,
  "waypoint": `Restaurant`,
  "price": 105,
  "info": {
    "name": `Munich`,
    "description": `"Munich, with crowded streets, in a middle of Europe, a perfect place to stay with a family."`,
    "images": [[{src: `http://picsum.photos/300/200?r=0.8311431352799774`, description: `Munich parliament building`}]]},
  "start": new Date(),
  "end": new Date(),
  "offers": ``,
  "isFavorite": true
};

export const SortType = {
  DEFAULT: `event`,
  TIME: `time`,
  PRICE: `price`,
};

export const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`,
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

export const MenuTab = {
  TABLE: `Table`,
  STATS: `Stats`
};
