import {CITY_LIST, WAYPOINT_LIST, activity, transfer} from "../const.js";
import {getRandomInteger, getRandomIndex} from "../utils.js";


export const generateRoute = () => {
  return {
    waypoint: getRandomIndex(WAYPOINT_LIST),
    waypointTypes: {
      activity,
      transfer
    },
    destination: getRandomIndex(CITY_LIST),
    cost: getRandomInteger(30, 200),
    isOffers: Boolean(getRandomInteger(0, 1)),
    isDestinationInfo: Boolean(getRandomInteger(0, 1)),
    destinationInfo: null,
    offers: null,
  };
};
