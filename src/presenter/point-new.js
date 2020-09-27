import {PointFormView} from "../view/index.js";
import {isEscKeyPressed} from "../utils/utils.js";
import {remove, render, RenderPosition} from "../utils/dom-utils.js";
import {UserAction, UpdateType, BLANK_POINT} from "../const.js";

export default class PointNew {

  constructor(container, changeStatus) {
    this._container = container;
    this._changeStatus = changeStatus;

    this._pointNewView = null;
    this._callback = null;

    this._onSubmitHandler = this._onSubmitHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(callback) {
    if (this._pointNewView !== null) {
      return;
    }

    this._renderNewPoint(callback);
  }

  destroy() {
    if (this._pointNewView === null) {
      return;
    }

    remove(this._pointNewView);
    this._pointNewView = null;
    this._callback();

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  setSaving() {
    this._pointNewView.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._pointNewView.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this._pointNewView.shake(resetFormState);
  }

  _renderNewPoint(callback) {
    this._callback = callback;
    this._pointNewView = new PointFormView(BLANK_POINT, true);
    this._pointNewView.setFormSubmitHandler(this._onSubmitHandler);
    this._pointNewView.setDeletePointHandler(this._deleteClickHandler);

    render(this._container, this._pointNewView, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _onSubmitHandler(point) {
    this._changeStatus(
        UserAction.ADD_POINT,
        UpdateType.MAJOR,
        point
    );
  }

  _deleteClickHandler() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (!isEscKeyPressed(evt)) {
      return;
    }
    evt.preventDefault();
    this.destroy();
  }
}
