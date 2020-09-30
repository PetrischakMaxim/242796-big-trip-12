import AbstractView from '../abstract/abstract.js';

const createNewPointButtonTemplate = () => (
  `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">
      New event
    </button>`
);

export default class NewPointButton extends AbstractView {
  constructor() {
    super();
    this._newPointButtonClickHandler = this._newPointButtonClickHandler.bind(this);
    this._newPointButtonClick = null;
  }
  getTemplate() {
    return createNewPointButtonTemplate();
  }

  setEnabled(flag = true) {
    this.getElement().disabled = flag;
  }

  setClickHandler(callback) {
    this._newPointButtonClick = callback;
    this.getElement().addEventListener(`click`, this._newPointButtonClickHandler);
  }

  _newPointButtonClickHandler(evt) {
    evt.preventDefault();
    this._newPointButtonClick();
  }
}
