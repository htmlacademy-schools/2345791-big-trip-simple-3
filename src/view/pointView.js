import AbstractView from '../framework/view/abstract-view.js';
import {isPointFuture, translateDatetoDay, translateDatetoTime} from '../utils.js';

const createOfferItemTemplate = (offer) => {
  const {title, price} = offer;

  return (
    `<li class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
  </li>`
  );
};

const createOffersTemplate = (offerItems) => {
  const offerItemsTemplate = offerItems
    .map((offer) => createOfferItemTemplate(offer))
    .join('');

  return `<h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
  ${offerItemsTemplate}
  </ul>`;
};

const createPointTemplate = (point) => {
  const { destination, type, startDate, endDate, price, offers} = point;
  const filteredOffers = offers.filter((offer) => (offer !== undefined));
  const offersTemplate = createOffersTemplate(filteredOffers);

  const futureClassName = isPointFuture(endDate)
    ? 'event--future'
    : '';

  return (
    `<li class="trip-events__item">
    <div class="event ${futureClassName}">
      <time class="event__date" datetime=${translateDatetoDay(startDate)}>${translateDatetoDay(startDate)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime=${translateDatetoTime(startDate)}>${translateDatetoTime(startDate)}</time>
          &mdash;
          <time class="event__end-time" datetime=${translateDatetoTime(endDate)}>${translateDatetoTime(endDate)}</time>
        </p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>
      ${offersTemplate}
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`
  );
};
export default class PointView extends AbstractView {
  #point = null;
  #allOffers = [];

  constructor(point, offers) {
    super();
    this.#point = point;
    this.#allOffers = offers;
  }

  get template() {
    return createPointTemplate(this.#point, this.#allOffers);
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
