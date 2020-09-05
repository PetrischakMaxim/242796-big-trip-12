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
    price: getRandomInteger(10, 100)
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
  const startDate = currentDate + getRandomInteger(0, 2) * 3600000 + getRandomInteger(1, 60) * 60000;
  const endDate = startDate + getRandomInteger(1, 12) * 3600000 + getRandomInteger(1, 60) * 60000;
  const eventDates = {
    start: new Date(startDate),
    end: new Date(endDate)
  };
  currentDate = endDate;

  return eventDates;
};

export const generatePoint = () => {

  const wayPoint = getRandomIndex(WAYPOINT_LIST);
  const offers = generateOffers(OFFER_LIST, getRandomInteger(0, 3));
  const hasOffers = (offers.length !== 0) ? true : false;
  const {start, end} = generateTripDates();

  return {
    id: generateId(),
    waypoint: wayPoint,
    hasWaypoint: (wayPoint) ? true : false,
    waypointTypes: {
      activity,
      transfer
    },
    destination: getRandomIndex(CITY_LIST),
    price: getRandomInteger(30, 200),
    info: generateDescription(),
    start,
    end,
    offers,
    hasInfo: Boolean(getRandomInteger(0, 1)),
    hasOffers,
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
};
