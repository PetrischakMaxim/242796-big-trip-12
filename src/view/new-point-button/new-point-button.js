import AbstractView from '../abstract/abstract.js';

const createNewPointButtonTemplate = () => (
  `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">
      New event
   </button>`
);

export default class NewPointButton extends AbstractView {

  constructor() {
    super();
    this._clickHandler = this._clickHandler.bind(this);
    this._click = null;
  }

  getTemplate() {
    return createNewPointButtonTemplate();
  }

  setEnabled(flag = true) {
    this.getElement().disabled = flag;
  }

  setClickHandler(callback) {
    this._click = callback;
    this.getElement().addEventListener(`click`, this._clickHandler);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._click();
  }
}
