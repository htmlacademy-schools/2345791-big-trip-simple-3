import AbstractView from '../framework/view/abstract-view.js';
import {translatePointDueDate, isPointExpired, isPointRepeating} from '../utils.js';

const createPointTemplate = (point) => {
  const {description, dueDate, repeating, isArchived, isFavorited} = point;
  const date = dueDate !== null
    ? translatePointDueDate(dueDate)
    : '';

  const deadlineClassName = isPointExpired(dueDate)
    ? 'event--deadline'
    : '';

  const repeatClassName = isPointRepeating(repeating)
    ? 'event--repeat'
    : '';

  const archiveClassName = isArchived
    ? 'card__btn--archive card__btn--disabled'
    : 'card__btn--archive';

  const favoriteClassName = isFavorited
    ? 'card__btn--favorites card__btn--disabled'
    : 'card__btn--favorites';

  return (
    `<li class="trip-events__item">
      <div class="event ${deadlineClassName} ${repeatClassName} ${archiveClassName} ${favoriteClassName}">
        <time class="event__date" datetime=${date}>MAR 18</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/taxi.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${description}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">10:30</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">11:00</time>
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
            <span class="event__offer-price">20</span>
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
