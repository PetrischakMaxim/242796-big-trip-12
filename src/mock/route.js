export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateWayPoint = () => {
  const wayponintList = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check`, `Sightseeing`, `Restaurant`];
  const randomIndex = getRandomInteger(0, wayponintList.length);
  return wayponintList[randomIndex];
};

const getRandomDestination = () => {
  const cityList = [
    `Westminster`,
    `Florida`,
    `Boise`,
    `Boston`,
    `Fort Smith`,
    `Wilmington`,
    `Winston`,
    `Winter Haven`,
  ];
  const randomIndex = getRandomInteger(0, cityList.length);
  return cityList[randomIndex];
};

const generateSentence = (maxLenght = 5) => {
  const descriptionSentence = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`;
  const sentenceQuantity = getRandomInteger(1, maxLenght);
  return descriptionSentence.repeat(sentenceQuantity);
};

const generateImage = (maxLenght = 5) => {
  const imageUrl = `http://picsum.photos/248/152?r=`;
  const imagesQuantity = getRandomInteger(1, maxLenght);
  const imagesList = new Array(imagesQuantity).fill().map(()=> {
    const imageParam = getRandomInteger(1, 10);
    return `${imageUrl}${imageParam}`;
  });

  return [...new Set(imagesList)];
};

const getRandomOffer = () => {
  const offersList = [`Add luggage`, `Switch to comfort class`, `Add meal`, `Choose seats`];
  const randomIndex = getRandomInteger(0, offersList.length);
  return offersList[randomIndex];
};

export const generateRoute = () => {

  return {
    waypoint: generateWayPoint(),
    destination: getRandomDestination(),
    destinationInfo: {
      description: generateSentence(),
      photo: generateImage(),
    },
    offers: {
      offerDescription: getRandomOffer(),
      offerPrice: getRandomInteger(5, 100)
    },
  };
};
