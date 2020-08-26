import PointView from "../components/point/point-item.js";
import PointFormView from "../components/point/point-form.js";

import {render, replace, remove, checkEscKeyButton} from "../utils/dom-utils.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Point {

  constructor(container, changeStatus, changeMode) {
    this._container = container;
    this._changeStatus = changeStatus;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._pointEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._clickHandler = this._clickHandler.bind(this);
    this._formCloseHandler = this._formCloseHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointView(point);
    this._pointEditComponent = new PointFormView(point);

    this._pointComponent.setClickHandler(this._clickHandler);
    this._pointEditComponent.setFormSubmitHandler(this._formCloseHandler);
    this._pointEditComponent.setCloseButtonHandler(this._formCloseHandler);
    this._pointEditComponent.setFavoriteClickHandler(this._favoriteClickHandler);


    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this._container, this._pointComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToPoint();
    }
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
  }

  _replacePointToForm() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _clickHandler() {
    this._replacePointToForm();
  }

  _escKeyDownHandler(evt) {

    if (checkEscKeyButton(evt)) {
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
