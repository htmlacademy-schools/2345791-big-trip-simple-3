import {createElement} from '../render.js';

const createNewPointButtonTemplate = () => '<button class="control__button">+ ADD NEW POINT</button>';

export default class NewPointButtonView {
  getTemplate() {
    return createNewPointButtonTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
