import {createElement} from '../render.js';
import {translatePointDueDate, isPointExpired, isPointRepeating} from '../utils.js'

const createPointTemplate = (point) => {
  const {color, description, dueDate, repeating, isArchived, isFavorited} = point;
  const date = dueDate !== null
    ? translatePointDueDate(dueDate)
    : '';

  const deadlineClassName = isPointExpired(dueDate)
    ? 'card--deadline'
    : '';

  const repeatClassName = isPointRepeating(repeating)
    ? 'card--repeat'
    : '';

  const archiveClassName = isArchived
    ? 'card__btn--archive card__btn--disabled'
    : 'card__btn--archive';

  const favoriteClassName = isFavorited
    ? 'card__btn--favorites card__btn--disabled'
    : 'card__btn--favorites';

  return (
    `<article class="card card--${color} ${deadlineClassName} ${repeatClassName}">
      <div class="card__form">
        <div class="card__inner">
          <div class="card__control">
            <button type="button" class="card__btn card__btn--edit">
              edit
            </button>
            <button type="button" class="card__btn ${archiveClassName}">
              archive
            </button>
            <button
              type="button"
              class="card__btn ${favoriteClassName}"
            >
              favorites
            </button>
          </div>
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>
          <div class="card__textarea-wrap">
            <p class="card__text">${description}</p>
          </div>
          <div class="card__settings">
          <div class="card__details">
            <div class="card__dates">
              <div class="card__date-deadline">
                <p class="card__input-deadline-wrap">
                  <span class="card__date">${date}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </article>`
  );
};
export default class PointView {
  constructor(point) {
    this.point = point;
  }

  getTemplate() {
    return createPointTemplate(this.point);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  };

  removeElement() {
    this.element = null;
  }
}
