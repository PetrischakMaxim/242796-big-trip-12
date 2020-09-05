import PointFormView from "../view/point/point-form.js";
import {generateId} from "../utils/utils.js";
import {remove, render, RenderPosition} from "../utils/dom-utils.js";
import {UserAction, UpdateType} from "../const.js";

export default class PointNew {

  constructor(container, changeStatus) {
    this._container = container;
    this._changeStatus = changeStatus;

    this._pointEditView = null;

    this._onSubmitHandler = this._onSubmitHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._pointEditView !== null) {
      return;
    }
    this._pointEditView = new PointFormView();

    this._pointEditView.setFormSubmitHandler(this._onSubmitHandler);
    this._pointEditView.setDeletePointHandler(this._deleteClickHandler);

    render(this._container, this._pointEditView, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._pointEditView === null) {
      return;
    }

    remove(this._pointEditView);
    this._pointEditView = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _onSubmitHandler(point) {
    this._changeStatus(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        Object.assign({id: generateId()}, point)
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
