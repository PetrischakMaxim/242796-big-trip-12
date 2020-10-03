import PointView from "../../view/point/point.js";
import PointEditView from "../../view/point-edit/point-edit.js";

import {
  render,
  replace,
  remove,
  getElement,
} from "../../utils/dom-utils.js";

import {isEscPressed} from "../../utils/utils.js";

import {UpdateType, UserAction, State} from "../../const.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`,
};

export default class Point {
  constructor(container, changePoint, changeMode, changeData) {
    this._containerElement = getElement(container);
    this._changePoint = changePoint;
    this._changeMode = changeMode;
    this._changeData = changeData;
    this._destinations = null;
    this._view = null;
    this._editView = null;
    this._point = null;
    this._mode = Mode.DEFAULT;
    this._isShouldUpdateTrip = null;

    this._rollupPointEdit = this._rollupPointEdit.bind(this);
    this._rollupPointHandler = this._rollupPointHandler.bind(this);
    this._rollupPointEditHandler = this._rollupPointEditHandler.bind(this);
    this._submitPointEditHandler = this._submitPointEditHandler.bind(this);
    this._deletePointEditHandler = this._deletePointEditHandler.bind(this);
    this._favoriteCheckboxClickHandler = this._favoriteCheckboxClickHandler.bind(
        this
    );
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(point, destinations, offers) {
    this._point = point;
    this._destinations = destinations;
    this._offers = offers;

    const prevPointView = this._view;
    const prevPointEditView = this._editView;

    this._view = new PointView(point);

    this._editView = new PointEditView({
      point,
      destinations: this._destinations,
      offers: this._offers,
    });

    this._view.setRollupButtonClickHandler(this._rollupPointHandler);
    this._editView.setFormSubmitHandler(this._submitPointEditHandler);
    this._editView.setFormResetHandler(this._deletePointEditHandler);
    this._editView.setRollupButtonClickHandler(
        this._rollupPointEditHandler
    );

    this._editView.setFavoriteCheckboxClickHandler(
        this._favoriteCheckboxClickHandler
    );

    if (prevPointView === null || prevPointEditView === null) {
      render(this._containerElement, this._view);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._view, prevPointView);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._editView, prevPointEditView);
    }

    remove(prevPointView);
    remove(prevPointEditView);
  }

  destroy() {
    remove(this._view);
    remove(this._editView);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
      this._replacePointEditToPoint();
    }
  }

  setViewState(state) {
    switch (state) {
      case State.SAVING:
        this._editView.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._editView.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._editView.shakeForm();
        break;
    }
  }

  _replacePointToPointEdit() {
    replace(this._editView, this._view);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replacePointEditToPoint() {
    replace(this._view, this._editView);
    this._mode = Mode.DEFAULT;
  }

  _rollupPointEdit() {
    this._replacePointEditToPoint();
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _resetPointEdit() {
    this._editView.reset(this._point);
    this._rollupPointEdit();
  }

  _rollupPointHandler() {
    this._replacePointToPointEdit();
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _rollupPointEditHandler() {
    this._resetPointEdit();
  }

  _submitPointEditHandler(point) {
    const updateType = this._editView.isStartDateUpdate
      ? UpdateType.MINOR
      : UpdateType.PATCH;

    this._changeData(
        UserAction.UPDATE_POINT,
        updateType,
        point,
        this._rollupPointEdit
    );
  }

  _favoriteCheckboxClickHandler(point) {
    this._changeData(UserAction.UPDATE_POINT, UpdateType.PATCH, point);
  }

  _deletePointEditHandler(point) {
    this._changeData(UserAction.DELETE_POINT, UpdateType.MAJOR, point);
  }

  _escKeyDownHandler(evt) {
    if (isEscPressed(evt)) {
      evt.preventDefault();
      this._resetPointEdit();
    }
  }
}
