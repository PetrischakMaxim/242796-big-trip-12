import EventItemView from "../components/event/event-item.js";
import EventFormView from "../components/event/event-form.js";

import {render, replace} from "../utils/dom-utils.js";

export default class Waypoint {

  constructor(container) {
    this._container = container;

    this._eventComponent = null;
    this._eventFormComponent = null;

    this._clickHandler = this._clickHandler.bind(this);
    this._submitHandler = this._submitHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);

  }

  init(waypoint) {
    this._waypoint = waypoint;

    this._eventComponent = new EventItemView(waypoint);
    this._eventFormComponent = new EventFormView(waypoint);

    this._eventComponent.setClickHandler(this._clickHandler);
    this._eventFormComponent.setFormSubmitHandler(this._submitHandler);

    render(this._container, this._eventComponent);
  }
}
