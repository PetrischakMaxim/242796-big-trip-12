import {PointView, PointFormView} from "../view/index.js";
import {render, replace, remove} from "../utils/dom-utils.js";
import {isEscKeyPressed} from "../utils/utils.js";
import {UserAction, UpdateType} from "../const.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`
};

export default class Point {

  constructor(container, changeStatus, changeMode) {
    this._container = container;
    this._changeStatus = changeStatus;
    this._changeMode = changeMode;

    this._pointView = null;
    this._pointEditView = null;
    this._mode = Mode.DEFAULT;

    this._openFormClickHandler = this._openFormClickHandler.bind(this);
    this._closeFormClickHandler = this._closeFormClickHandler.bind(this);
    this._formSaveHandler = this._formSaveHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointView = this._pointView;
    const prevPointEditView = this._pointEditView;

    this._pointView = new PointView(point);
    this._pointEditView = new PointFormView(point);

    this._pointView.setClickHandler(this._openFormClickHandler);
    this._pointEditView.setFormSubmitHandler(this._formSaveHandler);
    this._pointEditView.setCloseButtonHandler(this._closeFormClickHandler);
    this._pointEditView.setDeletePointHandler(this._deleteClickHandler);
    this._pointEditView.setFavoriteClickHandler(this._favoriteClickHandler);

    if (prevPointView === null || prevPointEditView === null) {
      render(this._container, this._pointView);
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

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToPoint();
    }
  }

  destroy() {
    remove(this._pointView);
    remove(this._pointEditView);
  }

  setViewState(state) {

    const resetFormState = () => {
      this._pointEditView.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.SAVING:
        this._pointEditView.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;
      case State.DELETING:
        this._pointEditView.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
      case State.ABORTING:
        this._pointView.shake(resetFormState);
        this._pointEditView.shake(resetFormState);
        break;
    }
  }

  _replacePointToForm() {
    replace(this._pointEditView, this._pointView);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToPoint() {
    replace(this._pointView, this._pointEditView);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _openFormClickHandler() {
    this._replacePointToForm();
  }

  _closeFormClickHandler() {
    this._replaceFormToPoint();
  }

  _escKeyDownHandler(evt) {
    if (isEscKeyPressed(evt)) {
      evt.preventDefault();
      this._replaceFormToPoint();
    }
  }

  _favoriteClickHandler(point) {
    this._changeStatus(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        point
    );
  }

  _formSaveHandler(point) {
    this._changeStatus(
        UserAction.UPDATE_POINT,
        UpdateType.MAJOR,
        point
    );
  }

  _deleteClickHandler(point) {
    this._changeStatus(
        UserAction.DELETE_POINT,
        UpdateType.MAJOR,
        point
    );
  }

}
