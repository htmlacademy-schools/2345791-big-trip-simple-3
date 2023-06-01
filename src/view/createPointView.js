import {createElement} from '../render.js';

const createNewPointButtonTemplate = () => '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow"> ADD NEW POINT</button>';

export default class NewPointButtonView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createNewPointButtonTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
