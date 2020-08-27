export const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomIndex = (array) => array[getRandomInteger(0, array.length - 1)];

export const sortPrice = (min, max) => (max.cost - min.cost);

export const sortDate = (d1, d2) => (d2.tripDates.start.getTime() - d1.tripDates.start.getTime());

export const generateSentence = (sentence, maxLength = 5) => {
  const sentenceQuantity = getRandomInteger(1, maxLength);
  return sentence.repeat(sentenceQuantity);
};

export const generateImage = (url, maxLength = 5) => {
  const imagesQuantity = getRandomInteger(1, maxLength);
  const imagesList = new Array(imagesQuantity)
    .fill()
    .map(() => {
      const imageParam = getRandomInteger(1, 10);
      return `${url}${imageParam}`;
    });

  return [...new Set(imagesList)];
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};
