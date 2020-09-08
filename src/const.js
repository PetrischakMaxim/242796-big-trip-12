export const TRIP_IMAGE_URL = `http://picsum.photos/248/152?r=`;
export const TRIP_SENTENCE = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`;

export const CITY_LIST = [
  `Westminster`,
  `Florida`,
  `Boise`,
  `Boston`,
  `Fort Smith`,
  `Wilmington`,
  `Winston`,
  `Winter Haven`,
];

const WAYPOINT = {
  types: {
    transfer: [
      `Taxi`,
      `Bus`,
      `Train`,
      `Ship`,
      `Transport`,
      `Drive`,
      `Flight`
    ],
    activity: [
      `Check-in`,
      `Sightseeing`,
      `Restaurant`,
    ],
  }
};

export const {types: {transfer, activity}} = WAYPOINT;
export const WAYPOINT_LIST = [...transfer, ...activity];

export const OFFER_LIST = [
  `Add luggage`,
  `Switch to comfort class`,
  `Add meal`,
  `Choose seats`
];

export const BLANK_POINT = {
  "waypoint": `Restaurant`,
  "hasWaypoint": true,
  "waypointTypes": {
    "activity": [`Check-in`, `Sightseeing`, `Restaurant`],
    "transfer": [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`]},
  "destination": `Florida`,
  "price": 105,
  "info": {"description": `Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    "images": [`http://picsum.photos/248/152?r=7`, `http://picsum.photos/248/152?r=3`]},
  "start": new Date(),
  "end": new Date(),
  "offers": [{"name": `Switch to comfort class`, "price": 63}, {"name": `Choose seats`, "price": 79}],
  "hasInfo": true,
  "hasOffers": true,
  "isFavorite": false
};

export const POINT_COUNT = 5;

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
  MAJOR: `MAJOR`
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
