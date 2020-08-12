import {CITY_LIST, WAYPOINT_LIST, OFFER_LIST, TRIP_IMAGE_URL, TRIP_SENTENCE, activity, transfer} from "../const.js";
import {getRandomInteger, getRandomIndex} from "../utils.js";

const generateOffers = (offers, count) => {
  return new Array(count).fill().map(() => ({name: getRandomIndex(offers), cost: getRandomInteger(10, 100)}));
};


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

const generateDescription = () => ({description: generateSentence(), images: generateImage()});

export const generateRoute = () => {
  return {
    waypoint: getRandomIndex(WAYPOINT_LIST),
    waypointTypes: {
      activity,
      transfer
    },
    destination: getRandomIndex(CITY_LIST),
    cost: getRandomInteger(30, 200),
    isDestinationInfo: Boolean(getRandomInteger(0, 1)),
    isOffers: Boolean(getRandomInteger(0, 1)),
    info: generateDescription(),
    offers: generateOffers(OFFER_LIST, getRandomInteger(0, 3)),
  };
};
