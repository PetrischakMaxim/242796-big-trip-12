import EventItemView from "../components/event/event-item.js";
import EventFormView from "../components/event/event-form.js";

import {render, replace, remove} from "../utils/dom-utils.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Route {

  constructor(container, changeStatus, changeMode) {
    this._container = container;
    this._changeStatus = changeStatus;
    this._changeMode = changeMode;

    this._eventComponent = null;
    this._eventEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._clickHandler = this._clickHandler.bind(this);
    this._formCloseHandler = this._formCloseHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  init(route) {
    this._route = route;

    const prevEventComponent = this._eventComponent;
    const prevEventEditComponent = this._eventEditComponent;

    this._eventComponent = new EventItemView(route);
    this._eventEditComponent = new EventFormView(route);

    this._eventComponent.setClickHandler(this._clickHandler);
    this._eventEditComponent.setFormSubmitHandler(this._formCloseHandler);
    this._eventEditComponent.setCloseButtonHandler(this._formCloseHandler);
    this._eventEditComponent.setFavoriteClickHandler(this._favoriteClickHandler);


    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this._container, this._eventComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditFormToEvent();
    }
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditComponent);
  }

  _replaceEventToEditForm() {
    replace(this._eventEditComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceEditFormToEvent() {
    replace(this._eventComponent, this._eventEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _clickHandler() {
    this._replaceEventToEditForm();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._replaceEditFormToEvent();
    }
  }

  _favoriteClickHandler() {
    this._changeStatus(Object.assign({}, this._route, {isFavorite: !this._route.isFavorite}));
  }

  _formCloseHandler(route) {
    this._changeStatus(route);
    this._replaceEditFormToEvent();
  }

}
