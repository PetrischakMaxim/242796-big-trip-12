import PointView from '../../view/point/point.js';
import PointEditView from '../../view/point-edit/point-edit.js';

import {
  RenderPosition,
  render,
  replace,
  remove,
  getElement,
} from '../../utils/dom-utils';

import {
  isEscPressed,
} from '../../utils/utils';

import {
  UpdateType,
  UserAction,
  State,
} from '../../const';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

const {
  BEFORE_END,
} = RenderPosition;

export default class Point {
  constructor(pointContainer, changePoint, changeMode, changeData) {
    this._pointContainerElement = getElement(pointContainer);
    this._changePoint = changePoint;
    this._changeMode = changeMode;
    this._changeData = changeData;
    this._destinations = null;
    this._pointView = null;
    this._pointEditView = null;
    this._point = null;
    this._mode = Mode.DEFAULT;
    this._isShouldUpdateTrip = null;

    this._rollupPointEdit = this._rollupPointEdit.bind(this);
    this._rollupPointHandler = this._rollupPointHandler.bind(this);
    this._rollupPointEditHandler = this._rollupPointEditHandler.bind(this);
    this._submitPointEditHandler = this._submitPointEditHandler.bind(this);
    this._deletePointEditHandler = this._deletePointEditHandler.bind(this);
    this._favoriteCheckboxClickHandler = this._favoriteCheckboxClickHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(point, destinations, offers) {
    this._point = point;
    this._destinations = destinations;
    this._offers = offers;

    const prevPointView = this._pointView;
    const prevPointEditView = this._pointEditView;

    this._pointView = new PointView(point);

    this._pointEditView = new PointEditView({
      point,
      destinations: this._destinations,
      offers: this._offers,
    });

    this._pointView.setRollupButtonClickHandler(this._rollupPointHandler);
    this._pointEditView.setFormSubmitHandler(this._submitPointEditHandler);
    this._pointEditView.setFormResetHandler(this._deletePointEditHandler);
    this._pointEditView.setRollupButtonClickHandler(this._rollupPointEditHandler);
    this._pointEditView.setFavoriteCheckboxClickHandler(this._favoriteCheckboxClickHandler);

    if (prevPointView === null || prevPointEditView === null) {
      render(this._pointContainerElement, this._pointView, BEFORE_END);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointView, prevPointView);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointEditView, prevPointEditView);
    }

    remove(prevPointView);
    remove(prevPointEditView);
  }

  destroy() {
    remove(this._pointView);
    remove(this._pointEditView);
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
        this._pointEditView.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._pointEditView.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._pointEditView.shakeForm();
        break;
    }
  }

  _replacePointToPointEdit() {
    replace(this._pointEditView, this._pointView);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replacePointEditToPoint() {
    replace(this._pointView, this._pointEditView);
    this._mode = Mode.DEFAULT;
  }

  _rollupPointEdit() {
    this._replacePointEditToPoint();
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _resetPointEdit() {
    this._pointEditView.reset(this._point);
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
    const updateType = this._pointEditView.isStartDateUpdate
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
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        point
    );
  }

  // Use as delede in view
  _deletePointEditHandler(point) {
    this._changeData(
        UserAction.DELETE_POINT,
        UpdateType.MAJOR,
        point
    );
  }

  _escKeyDownHandler(evt) {
    if (isEscPressed(evt)) {
      evt.preventDefault();
      this._resetPointEdit();
    }
  }
}
