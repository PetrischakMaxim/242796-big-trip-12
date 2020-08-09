import {CITY_LIST, WAYPOINT_LIST, activity, transfer, OFFER_LIST, TRIP_IMAGE_URL, TRIP_SENTENCE} from "../const.js";
import {getRandomInteger, getRandomIndex} from "../utils.js";

const generateSentence = (maxLength = 5) => {
  const sentenceQuantity = getRandomInteger(1, maxLength);
  return TRIP_SENTENCE.repeat(sentenceQuantity);
};

const generateImage = (maxLength = 5) => {
  const imagesQuantity = getRandomInteger(1, maxLength);
  const imagesList = new Array(imagesQuantity).fill().map(()=> {
    const imageParam = getRandomInteger(1, 10);
    return `${TRIP_IMAGE_URL}${imageParam}`;
  });

  return [...new Set(imagesList)];
};

export const generateRoute = () => {
  return {
    waypoint: getRandomIndex(WAYPOINT_LIST),
    waypointTypes: {
      activity,
      transfer
    },
    destination: getRandomIndex(CITY_LIST),
    cost: getRandomInteger(30, 200),
    destinationInfo: {
      description: generateSentence(),
      photo: generateImage(),
    },
    offers: {
      offerDescription: getRandomIndex(OFFER_LIST),
      offerPrice: getRandomInteger(5, 100)
    },
  };
};
