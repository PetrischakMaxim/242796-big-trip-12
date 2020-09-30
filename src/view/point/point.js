import AbstractView from '../abstract/abstract.js';
import {createOfferTemplate} from './templates/create-offer-template.js';
import {getPointTypeWithPreposition} from '../../utils/type-preposition-utils.js';
import {convertDurationValue} from '../../utils/utils.js';
import {formatDateISODdMmYyyyHhMm} from '../../utils/date-utils.js';

const OFFERS_COUNT = 3;

const createPointTemplate = (point) => {
  const {
    type,
    start,
    end,
    duration,
    price,
    offers,
    destination,
  } = point;

  const durationValue = convertDurationValue(duration);
  const formatedStartDate = formatDateISODdMmYyyyHhMm(start);
  const formatedEndDate = formatDateISODdMmYyyyHhMm(end);

  return (
    `<div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${getPointTypeWithPreposition(type)} ${destination.name}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${formatedStartDate}">${formatedStartDate.split(`T`)[1]}</time>
          &mdash;
          <time class="event__end-time" datetime="${formatedEndDate}">${formatedEndDate.split(`T`)[1]}</time>
        </p>
        <p class="event__duration">${durationValue}</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offers
          .slice(0, OFFERS_COUNT)
          .map(createOfferTemplate).join(``)}
      </ul>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>`
  );
};

export default class Point extends AbstractView {
  constructor(point) {
    super();
    this._point = point;
    this._rollupButtonClickHandler = this._rollupButtonClickHandler.bind(this);
    this._rollupButtonClick = null;
  }

  getTemplate() {
    return createPointTemplate(this._point);
  }

  setRollupButtonClickHandler(callback) {
    this._rollupButtonClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._rollupButtonClickHandler);
  }

  _rollupButtonClickHandler(evt) {
    evt.preventDefault();
    this._rollupButtonClick();
  }
}
