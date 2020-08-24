import {
  CITY_LIST,
  WAYPOINT_LIST,
  OFFER_LIST,
  TRIP_IMAGE_URL,
  TRIP_SENTENCE,
  activity,
  transfer
} from "../const.js";

import {getRandomInteger, getRandomIndex, generateId, generateSentence, generateImage} from "../utils/utils.js";

const generateOffers = (offers, count) => {
  return new Array(count)
  .fill()
  .map(() => ({
    name: getRandomIndex(offers),
    cost: getRandomInteger(10, 100)
  }));
};

const generateDescription = () => ({
  description: generateSentence(TRIP_SENTENCE),
  images: generateImage(TRIP_IMAGE_URL)
});

const maxDaysGap = 5;
const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
let currentDate = Number(new Date().setSeconds(0, 0)) + daysGap * 24 * 3600000;

const generateTripDates = () => {
  const startData = currentDate + getRandomInteger(0, 2) * 3600000 + getRandomInteger(1, 60) * 60000;
  const endData = startData + getRandomInteger(1, 12) * 3600000 + getRandomInteger(1, 60) * 60000;
  const eventData = {
    start: new Date(startData),
    end: new Date(endData)
  };
  currentDate = endData;

  return eventData;
};

export const generateRoute = () => {

  const wayPoint = getRandomIndex(WAYPOINT_LIST);
  const offers = generateOffers(OFFER_LIST, getRandomInteger(0, 3));
  const hasOffers = (offers.length !== 0) ? true : false;

  return {
    id: generateId(),
    waypoint: wayPoint,
    hasWaypoint: (wayPoint) ? true : false,
    waypointTypes: {
      activity,
      transfer
    },
    tripDates: generateTripDates(),
    destination: getRandomIndex(CITY_LIST),
    cost: getRandomInteger(30, 200),
    info: generateDescription(),
    offers,
    hasInfo: Boolean(getRandomInteger(0, 1)),
    hasOffers,
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
};
