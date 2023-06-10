import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { translatePointDueDate } from '../utils.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  id: 0,
  type: null,
  destination: null,
  startDate: null,
  endDate: null,
  price: null,
  offers: []
};

const types = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const createOfferItemTemplate = (offer, offers) => {
  const {title, price} = offer;
  const isActive = offers.includes(offer);

  return (
    `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title}-1" type="checkbox" name="event-offer-${title}" ${isActive ?
      'checked' : 'unchecked'}>
    <label class="event__offer-label" for="event-offer-${title}-1">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>`
  );
};

const createOffersTemplate = (allOffers, offers) => {
  const offerItemsTemplate = allOffers
    .map((offer) => createOfferItemTemplate(offer, offers))
    .join('');

  return `<div class="event__available-offers">
  ${offerItemsTemplate}
</div>`;
};

const createImageTemplate = (image) => {
  const {src, description} = image;
  return `
    <img class="event__photo" src=${src} alt=${description}>
  `;
};

const createImagesTemplate = (images) => {
  const imagesTemplate = images
    .map((image) => createImageTemplate(image))
    .join('');

  return `<div class="event__photos-container">
  <div class="event__photos-tape">
    ${imagesTemplate}
  </div>
</div>`;
};

const createDestinationTemplate = (destination) => (
  `<option value="${destination.name}"></option>`
);

const createDestinationsTemplate = (destinations, id) => (
  `<datalist id="destination-list-${id}">
  ${destinations.map((destination) => createDestinationTemplate(destination)).join('')}
</datalist>`
);

const createTypeTemplate = (type, id) => (
  `<div class="event__type-item">
  <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
  <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">${type.charAt(0).toUpperCase() + type.slice(1)}</label>
</div>`
);

const createTypesTemplate = (allTypes, id) => (
  `<input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

  <div class="event__type-list">
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>
      ${types.map((type) => createTypeTemplate(type, id))}
    </fieldset>
  </div>`
);

const createPointEditTemplate = (point = {}, allOffers, destinations) => {
  const {
    id,
    price,
    startDate,
    endDate,
    destination,
    type,
    offers
  } = point;
  if (point.type !== null) {
    allOffers = allOffers ? allOffers.find((offer) => (offer.type === point.type)).offers : [];
  }

  return (
    `<form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type ? type : ''}.png" alt="Event type icon">
        </label>
        ${createTypesTemplate(types, id)}
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-${id}">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value=${destination ? destination.name : 'No destination'} list="destination-list-${id}">
        ${createDestinationsTemplate(destinations, id)}
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-${id}">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value=${translatePointDueDate(startDate)}>
        &mdash;
        <label class="visually-hidden" for="event-end-time-${id}">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value=${translatePointDueDate(endDate)}>
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-${id}">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-${id}" type="number" name="event-price" value=${price}>
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        ${createOffersTemplate(allOffers, offers)}
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination ? destination.description : ''}</p>
        ${destination ? createImagesTemplate(destination.pictures) : ''}
      </section>
    </section>
  </form>`
  );
};

export default class PointEditView extends AbstractStatefulView {
  #startDatePicker = null;
  #endDatePicker = null;
  #offers = [];
  #destinations = [];

  #point = null;

  constructor(point = BLANK_POINT, offers, destinations) {
    super();

    this.#destinations = destinations;
    this.#offers = offers;

    this._state = PointEditView.parsePointToState(point);

    this.#setInnerHandlers();
    this.#setDatepicker();
  }

  get template() {
    return createPointEditTemplate(this._state, this.#offers, this.#destinations);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#startDatePicker) {
      this.#startDatePicker.destroy();
      this.#startDatePicker = null;
    }

    if (this.#endDatePicker) {
      this.#endDatePicker.destroy();
      this.#endDatePicker = null;
    }
  };

  reset = (point) => {
    this.updateElement(
      PointEditView.parsePointToState(point),
    );
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.#setDatepicker();
    this.setDeleteHandler(this._callback.deleteClick);
  };

  #typeToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
    });
  };

  #destinationInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      destination: evt.target.value,
    });
  };

  #startDateChangeHandler = ([userDate]) => {
    this.updateElement({
      startDate: userDate,
    });
  };

  #endDateChangeHandler = ([userDate]) => {
    this.updateElement({
      endDate: userDate,
    });
  };

  #offersChangeHandler = ([offer]) => {
    if (!this._state.offers.includes(offer)) {
      this.updateElement({
        offers: this._state.offers.push(offer),
      });
    } else {
      const index = this._state.offers.indexOf(offer);
      this.updateElement({
        offers: this._state.offers.splice(index, 1),
      });
    }
  };

  #priceChangeHandler = (evt) => {
    this.updateElement({
      price: parseInt(evt.target.value, 10),
    });
  };


  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#formSubmitHandler);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(PointEditView.parseStateToPoint(this._state));
  };

  setClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };

  setDeleteHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteHandler);
  };

  #deleteHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(PointEditView.parseStateToPoint(this._state));
  };

  #setDatepicker = () => {
    this.#startDatePicker = flatpickr (
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/M/y H:i',
        defaultDate: this._state.startDate,
        onChange: this.#startDateChangeHandler,
        enableTime: true
      },
    );
    this.#endDatePicker = flatpickr (
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/M/y H:i',
        defaultDate: this._state.endDate,
        onChange: this.#endDateChangeHandler,
        enableTime: true
      },
    );
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeToggleHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationInputHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#offersChangeHandler);
  };

  static parsePointToState = (point) => ({...point,
    isTypeChanged: point.type !== null,
    isDestinationChanged: point.destination !== null,
  });

  static parseStateToPoint = (state) => {
    const point = {...state};

    if (!point.isTypeChanged) {
      point.type = null;
    }

    delete point.isTypeChanged;
    delete point.isDestinationChanged;

    return point;
  };
}
export {BLANK_POINT};
