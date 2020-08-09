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

export const TRIP_IMAGE_URL = `http://picsum.photos/248/152?r=`;

export const TRIP_SENTENCE = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`;
