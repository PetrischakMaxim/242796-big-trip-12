import AbstractView from '../../view/abstract/abstract.js';
import PointEditView from '../../view/point-edit/point-edit.js';

import {UserAction, UpdateType} from '../../const.js';
import {isEscPressed} from '../../utils/utils.js';

import {
  remove,
  render,
  RenderPosition,
  getElement,
} from '../../utils/dom-utils.js';

const {
  AFTER_BEGIN,
  AFTER_END,
} = RenderPosition;

export default class PointNew {
  constructor(container, changeData) {
    this._containerElement = getElement(container);
    this._changeData = changeData;

    this._editView = null;
    this._destroyCallback = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formResetHandler = this._formResetHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(destinations, offers, callback) {
    if (this._editView !== null) {
      return;
    }

    this._renderEdit(destinations, offers, callback);
  }

  destroy() {
    if (this._editView === null) {
      return;
    }

    remove(this._editView);
    this._editView = null;
    this._destroyCallback();
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  setSaving() {
    this._editView.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    this._editView.shakeForm();
  }

  _renderEdit(destinations, offers, callback) {
    this._destroyCallback = callback;

    this._editView = new PointEditView({destinations, offers, isAddMode: true});
    this._editView.setFormSubmitHandler(this._formSubmitHandler);
    this._editView.setFormResetHandler(this._formResetHandler);

    if (this._containerElement instanceof AbstractView) {
      this._containerElement = this._containerElement.getElement();
    }

    const sortTripElement = this._containerElement.querySelector(`.trip-sort`);

    if (sortTripElement) {
      render(sortTripElement, this._editView, AFTER_END);
    } else {
      render(this._containerElement, this._editView, AFTER_BEGIN);
    }

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _formSubmitHandler(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MAJOR,
        point
    );
  }

  _formResetHandler() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (isEscPressed(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
