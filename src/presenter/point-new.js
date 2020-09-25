import PointFormView from "../view/point/point-form.js";
import {remove, render, RenderPosition} from "../utils/dom-utils.js";
import {UserAction, UpdateType, BLANK_POINT} from "../const.js";

export default class PointNew {

  constructor(container, changeStatus) {
    this._container = container;
    this._changeStatus = changeStatus;

    this._pointNewView = null;

    this._onSubmitHandler = this._onSubmitHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(callback) {
    this._callback = callback;

    if (this._pointNewView !== null) {
      return;
    }
    this._pointNewView = new PointFormView(BLANK_POINT, true);
    this._pointNewView.setFormSubmitHandler(this._onSubmitHandler);
    this._pointNewView.setDeletePointHandler(this._deleteClickHandler);

    render(this._container, this._pointNewView, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._pointNewView === null) {
      return;
    }

    remove(this._pointNewView);
    this._pointNewView = null;
    if (this._callback !== null) {
      this._callback();
    }

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _onSubmitHandler(point) {
    this._changeStatus(
        UserAction.ADD_POINT,
        UpdateType.MAJOR,
        point
    );
    this.destroy();
  }

  _deleteClickHandler() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
