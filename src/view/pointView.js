import AbstractView from '../framework/view/abstract-view.js';
import {translatePointDueDate, isPointFuture} from '../utils.js';

const createPointTemplate = (point) => {
  const {description, dueDate, price} = point;
  const date = dueDate !== null
    ? translatePointDueDate(dueDate)
    : '';

  const futureClassName = isPointFuture(dueDate)
    ? 'event--future'
    : '';

  return (
    `<li class="trip-events__item">
      <div class="event ${futureClassName}">
        <time class="event__date" datetime=${date}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/taxi.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${description}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime=${date}</time>
            &mdash;
            <time class="event__end-time" datetime=${date}</time>
          </p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">20</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          <li class="event__offer">
            <span class="event__offer-title">Order Uber</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
          </li>
        </ul>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};
export default class PointView extends AbstractView {
  #point = null;

  constructor(point) {
    super();
    this.#point = point;
  }

  get template() {
    return createPointTemplate(this.#point);
  }

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  };


  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };
}
