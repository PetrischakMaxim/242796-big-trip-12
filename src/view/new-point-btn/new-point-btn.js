import AbstractView from '../abstract/abstract.js';

export default class NewPointBtn extends AbstractView {

  constructor() {
    super();
    this._newPointBtnClickHandler = this._newPointBtnClickHandler.bind(this);
    this._newPointBtnClick = null;
  }

  getTemplate() {
    return (
      `<button class="trip-main__event-add-btn btn btn--big btn--yellow" type="button">
         New event
      </button>`
    );
  }

  toggleButtonState(flag = true) {
    this.getElement().disabled = flag;
  }

  setClickHandler(callback) {
    this._newPointBtnClick = callback;
    this.getElement().addEventListener(`click`, this._newPointBtnClickHandler);
  }

  _newPointBtnClickHandler(evt) {
    evt.preventDefault();
    this._newPointBtnClick();
  }
}
