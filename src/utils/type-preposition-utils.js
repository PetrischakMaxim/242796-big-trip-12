import {capitalizeString} from './utils.js';
import {pointTypeToPreposition} from '../const.js';

export const getPointTypeWithPreposition = (currentType) => {
  const titleType = capitalizeString(currentType);
  const preposition = pointTypeToPreposition[currentType];
  return preposition ? `${titleType} ${preposition}` : ``;
};

