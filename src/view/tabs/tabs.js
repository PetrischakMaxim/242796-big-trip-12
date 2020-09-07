import AbstractView from "../abstract/abstract.js";
import {MenuTab} from "../../const.js";

const createTabsTemplate = () => (
  `<div class="trip-controls-wrapper">
    <h2 class="visually-hidden">Switch trip view</h2>
    <nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active"  data-tab="${MenuTab.TABLE}" href="#">${MenuTab.TABLE}</a>
      <a class="trip-tabs__btn" data-tab="${MenuTab.STATS}" href="#">${MenuTab.STATS}</a>
    </nav>
  </div>`
);

export default class Tabs extends AbstractView {

  constructor() {
    super();

    this._tabClickHandler = this._tabClickHandler.bind(this);
    this._activeClassName = `trip-tabs__btn--active`;
    this._click = null;
  }

  getTemplate() {
    return createTabsTemplate();
  }

  setTabClickHandler(callback) {
    this._click = callback;
    this.getElement()
    .querySelectorAll(`[data-tab]`)
    .forEach((tab) => {
      tab.addEventListener(`click`, this._tabClickHandler);
    });
  }

  _setActiveTab(tab) {
    const currentTab = this.getElement().querySelector(`[data-tab=${tab}]`);
    const prevActiveTab = currentTab.previousElementSibling || currentTab.nextElementSibling;

    if (currentTab !== null) {
      currentTab.classList.add(this._activeClassName);
      prevActiveTab.classList.remove(this._activeClassName);

    }
  }

  _tabClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.nodeName === `A`) {
      this._click(evt.target.dataset.tab);
      this._setActiveTab(evt.target.dataset.tab);
    }
  }

}
