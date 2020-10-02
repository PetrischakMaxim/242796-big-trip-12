import SmartView from '../smart/smart.js';
import {createHeaderTemplate} from './templates/create-header-template.js';
import {createDetailsTemplate} from './templates/create-details-template.js';
import flatpickr from 'flatpickr';
import '../../../node_modules/flatpickr/dist/flatpickr.min.css';
import {ACTIVITIES} from '../../const.js';
import {extend} from '../../utils/utils.js';
import {addDaysToDate} from '../../utils/date-utils.js';

const BLANK_DESTINATION = {
  name: ``,
  pictures: [],
  description: ``,
};

const getBlankPoint = () => {
  const start = new Date();
  const end = addDaysToDate(new Date());

  return {
    type: ACTIVITIES[0].toLowerCase(),
    destination: BLANK_DESTINATION,
    start,
    end,
    duration: end - start,
    price: 0,
    offers: [],
    isFavorite: false,
  };
};

const isOfferInclude = (offers, currentOffer) => offers.some((offer) => (
  offer.title === currentOffer.title && offer.price === currentOffer.price
));

const convertToRenderedOffers = (offers, activeOffers) => offers.map((offer) => {

  return {
    title: offer.title,
    price: offer.price,
    isActivated: activeOffers.length > 0 && isOfferInclude(activeOffers, offer),
  };
});

const convertFromRenderedOffers = (renderedOffers) => renderedOffers.reduce((offers, offer) => {
  if (offer.isActivated) {
    offers.push({
      title: offer.title,
      price: offer.price,
    });
  }

  return offers;
}, []);

const getDestination = (destinations, destinationName) => destinations.find(
    (destination) => destination.name === destinationName
);

const createPointEditTemplate = (pointData, destinations, isAddMode) => {

  return (
    `<form class="trip-events__item event  event--edit" action="#" method="post">
      ${createHeaderTemplate(pointData, destinations, isAddMode)}
      ${createDetailsTemplate(pointData)}
    </form>`
  );
};

export default class PointEdit extends SmartView {
  constructor({point = getBlankPoint(), destinations, offers, isAddMode = false}) {
    super();
    this._data = PointEdit.parsePointToData(point, destinations, offers);
    this._point = point;
    this._destinations = destinations;
    this._offers = offers;
    this._isAddMode = isAddMode;
    this._typeListElement = null;
    this._startDatePicker = null;
    this._endDatePicker = null;
    this.isStartDateUpdate = false;

    this.resetFormState = this.resetFormState.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formResetHandler = this._formResetHandler.bind(this);
    this._rollupButtonClickHandler = this._rollupButtonClickHandler.bind(this);
    this._favoriteCheckboxClickHandler = this._favoriteCheckboxClickHandler.bind(this);
    this._priceInputChangeHandler = this._priceInputChangeHandler.bind(this);
    this._typeInputChangeHandler = this._typeInputChangeHandler.bind(this);
    this._destinationInputChangeHandler = this._destinationInputChangeHandler.bind(this);
    this._offerCheckboxChangeHandler = this._offerCheckboxChangeHandler.bind(this);
    this._startDateInputChangeHandler = this._startDateInputChangeHandler.bind(this);
    this._endDateInputChangeHandler = this._endDateInputChangeHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createPointEditTemplate(this._data, this._destinations, this._isAddMode);
  }

  removeElement() {
    super.removeElement();
    this._destroyPointDatePickers();
  }

  reset(point) {
    this.updateData(
        PointEdit.parsePointToData(point, this._destinations, this._offers)
    );
  }

  resetFormState() {
    this.updateData({
      isFavorite: this._point.isFavorite,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    });
  }

  shakeForm() {
    this.shake(this.resetFormState);
  }

  setFormSubmitHandler(callback) {
    this._formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  setFormResetHandler(callback) {
    this._formReset = callback;
    this.getElement().addEventListener(`reset`, this._formResetHandler);
  }

  setRollupButtonClickHandler(callback) {
    this._rollupButtonClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._rollupButtonClickHandler);
  }

  setFavoriteCheckboxClickHandler(callback) {
    this._favoriteCheckboxClick = callback;
    this.getElement().querySelector(`.event__favorite-checkbox`)
      .addEventListener(`click`, this._favoriteCheckboxClickHandler);
  }

  restoreHandlers() {
    if (!this._isAddMode) {
      this.setRollupButtonClickHandler(this._rollupButtonClick);
      this.setFavoriteCheckboxClickHandler(this._favoriteCheckboxClick);
    }

    this.setFormSubmitHandler(this._formSubmit);
    this.setFormResetHandler(this._formReset);

    this._setInnerHandlers();
  }

  _destroyStartDatePicker() {
    if (this._startDatePicker !== null) {
      this._startDatePicker.destroy();
      this._startDatePicker = null;
    }
  }

  _destroyEndDatePicker() {
    if (this._endDatePicker !== null) {
      this._endDatePicker.destroy();
      this._endDatePicker = null;
    }
  }

  _destroyPointDatePickers() {
    this._destroyStartDatePicker();
    this._destroyEndDatePicker();
  }

  _setTypeInputChangeHandlers() {
    const typeElements = this.getElement().querySelectorAll(`.event__type-input`);
    typeElements.forEach((typeElement) => {
      typeElement.addEventListener(`change`, this._typeInputChangeHandler);
    });
  }

  _setOfferCheckboxChangeHandlers() {
    const offerElements = this.getElement().querySelectorAll(`.event__offer-checkbox`);
    offerElements.forEach((offerElement) => {
      offerElement.addEventListener(`change`, this._offerCheckboxChangeHandler);
    });
  }

  _setStartDateInputChangeHandler() {
    this._destroyStartDatePicker();
    this._startDatePicker = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        {
          'enableTime': true,
          'time_24hr': true,
          'dateFormat': `d/m/y H:i`,
          'defaultDate': this._data.start || new Date(),
          'minDate': this._data.start || new Date(),
          'onChange': this._startDateInputChangeHandler,
        }
    );
  }

  _setEndDateInputChangeHandler() {
    this._destroyEndDatePicker();
    this._endDatePicker = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        {
          'enableTime': true,
          'time_24hr': true,
          'dateFormat': `d/m/y H:i`,
          'defaultDate': this._data.end || new Date(),
          'minDate': this._data.start,
          'onChange': this._endDateInputChangeHandler,
        }
    );
  }

  _setInnerHandlers() {
    const element = this.getElement();

    element.querySelector(`.event__input--price`).addEventListener(`change`, this._priceInputChangeHandler);
    element.querySelector(`.event__input--destination`).addEventListener(`change`, this._destinationInputChangeHandler);
    this._setTypeInputChangeHandlers();
    this._setOfferCheckboxChangeHandlers();
    this._setStartDateInputChangeHandler();
    this._setEndDateInputChangeHandler();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._formSubmit(PointEdit.parseDataToPoint(this._data));
  }

  _formResetHandler(evt) {
    evt.preventDefault();
    this._formReset(PointEdit.parseDataToPoint(this._data));
  }

  _rollupButtonClickHandler(evt) {
    evt.preventDefault();
    this._rollupButtonClick();
  }

  _favoriteCheckboxClickHandler(evt) {
    evt.preventDefault();

    this.updateData({
      isFavorite: evt.target.checked,
    });
  }

  _priceInputChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: Number(evt.target.value),
    }, true);
  }

  _typeInputChangeHandler(evt) {
    evt.preventDefault();
    const type = evt.target.value.toLowerCase();
    const typeOffers = this._offers[type];

    const renderedOffers = typeOffers.length > 0
      ? convertToRenderedOffers(typeOffers, [])
      : [];

    this.updateData({
      type,
      renderedOffers,
    });
  }

  _destinationInputChangeHandler(evt) {
    evt.preventDefault();

    const destination = getDestination(this._destinations, evt.target.value);
    this.updateData({
      destination: !destination ? BLANK_DESTINATION : destination,
      isDestinationError: !destination,
    });
  }

  _offerCheckboxChangeHandler(evt) {
    evt.preventDefault();
    const title = evt.target.dataset.title;
    const price = Number(evt.target.dataset.price);
    const renderedOffers = this._data.renderedOffers.map((offer) => {
      if (offer.title !== title && offer.price !== price) {
        return offer;
      }

      return {
        title,
        price,
        isActivated: evt.target.checked,
      };
    });

    this.updateData({
      renderedOffers,
    }, true);
  }

  _startDateInputChangeHandler([start]) {
    const end = this._data.end;

    this.isStartDateUpdate = start !== this._data.start;

    this.updateData({
      start,
      duration: end - start,
    }, true);

    this._endDatePicker.set(`minDate`, start);
  }

  _endDateInputChangeHandler([end]) {
    const start = this._data.start;

    this.updateData({
      end,
      duration: end - start,
    }, true);

    this._startDatePicker.set(`maxDate`, end);
  }

  static parsePointToData(point, destinations, offers) {
    const {destination, type} = point;
    const typeOffers = offers[type];

    const renderedOffers = typeOffers.length > 0
      ? convertToRenderedOffers(typeOffers, point.offers)
      : [];

    return extend(
        point,
        {
          renderedOffers,
          isDestinationError: !getDestination(destinations, destination.name),
          isDisabled: false,
          isSaving: false,
          isDeleting: false,
        }
    );
  }

  static parseDataToPoint(pointData) {
    pointData = extend(
        pointData,
        {
          offers: convertFromRenderedOffers(pointData.renderedOffers),
        }
    );

    delete pointData.isDestinationError;
    delete pointData.renderedOffers;
    delete pointData.isDisabled;
    delete pointData.isSaving;
    delete pointData.isDeleting;

    return pointData;
  }
}
