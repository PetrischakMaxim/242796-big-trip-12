import PointView from "../view/point/point-item.js";
import PointFormView from "../view/point/point-form/point-form.js";

import {render, replace, remove} from "../utils/dom-utils.js";
import {isEscKeyPressed} from "../utils/utils.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Point {

  constructor(container, changeStatus, changeMode) {
    this._container = container;
    this._changeStatus = changeStatus;
    this._changeMode = changeMode;

    this._pointView = null;
    this._pointEditView = null;
    this._mode = Mode.DEFAULT;

    this._clickHandler = this._clickHandler.bind(this);
    this._formCloseHandler = this._formCloseHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointView = this._pointView;
    const prevPointEditView = this._pointEditView;

    this._pointView = new PointView(point);
    this._pointEditView = new PointFormView(point);

    this._pointView.setClickHandler(this._clickHandler);
    this._pointEditView.setFormSubmitHandler(this._formCloseHandler);
    this._pointEditView.setCloseButtonHandler(this._formCloseHandler);
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

  _clickHandler() {
    this._replacePointToForm();
  }

  _escKeyDownHandler(evt) {

    if (isEscKeyPressed(evt)) {
      evt.preventDefault();
      this._replaceFormToPoint();
    }
  }

  _favoriteClickHandler() {
    this._changeStatus(Object.assign({}, this._point, {isFavorite: !this._point.isFavorite}));
  }

  _formCloseHandler(point) {
    this._changeStatus(point);
    this._replaceFormToPoint();
  }

}
