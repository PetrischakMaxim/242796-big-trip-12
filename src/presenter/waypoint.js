import EventItemView from "../components/event/event-item.js";
import EventFormView from "../components/event/event-form.js";

import {render, replace, remove} from "../utils/dom-utils.js";

export default class Waypoint {

  constructor(container) {
    this._container = container;

    this._eventComponent = null;
    this._eventEditComponent = null;

    this._clickHandler = this._clickHandler.bind(this);
    this._formCloseHandler = this._formCloseHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(waypoint) {
    this._waypoint = waypoint;

    const prevEventComponent = this._eventComponent;
    const prevEventEditComponent = this._eventEditComponent;

    this._eventComponent = new EventItemView(waypoint);
    this._eventEditComponent = new EventFormView(waypoint);

    this._eventComponent.setClickHandler(this._clickHandler);
    this._eventEditComponent.setFormSubmitHandler(this._formCloseHandler);
    this._eventEditComponent.setCloseButtonHandler(this._formCloseHandler);


    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this._container, this._eventComponent);
      return;
    }

    if (this._container.contains(prevEventComponent.getElement())) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._container.contains(prevEventEditComponent.getElement())) {
      replace(this._eventEditComponent, prevEventEditComponent);
    }


    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditComponent);
  }

  _replaceEventToEditForm() {
    replace(this._eventEditComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _replaceEditFormToEvent() {
    replace(this._eventComponent, this._eventEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _clickHandler() {
    this._replaceEventToEditForm();
  }

  _formCloseHandler() {
    this._replaceEditFormToEvent();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._replaceEditFormToEvent();
    }
  }

}
