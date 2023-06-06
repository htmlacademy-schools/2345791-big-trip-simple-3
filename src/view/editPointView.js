import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { translatePointDueDate } from '../utils.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  id: 0,
  name: '',
  type: null,
  destination: null,
  startDate: null,
  endDate: null,
  price: null,
};

const createPointEditTemplate = (point = {}) => {
  const {
    id,
    type,
    destination,
    name,
    startDate,
    endDate,
    price,
    isTypeChanged,
  } = point;

  return (
    `<form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>

            <div class="event__type-item">
              <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
              <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
              <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
              <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
              <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
              <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
              <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
              <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
              <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
              <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
            </div>
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value=${destination} list="destination-list-1">
        <datalist id="destination-list-1">
          <option value="Amsterdam"></option>
          <option value="Geneva"></option>
          <option value="Chamonix"></option>
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value=${translatePointDueDate(startDate)}>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value=${translatePointDueDate(endDate)}>
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value=${price}>
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

        <div class="event__available-offers">
          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" checked>
            <label class="event__offer-label" for="event-offer-luggage-1">
              <span class="event__offer-title">Add luggage</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">50</span>
            </label>
          </div>

          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-1" type="checkbox" name="event-offer-comfort" checked>
            <label class="event__offer-label" for="event-offer-comfort-1">
              <span class="event__offer-title">Switch to comfort</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">80</span>
            </label>
          </div>

          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-meal-1" type="checkbox" name="event-offer-meal">
            <label class="event__offer-label" for="event-offer-meal-1">
              <span class="event__offer-title">Add meal</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">15</span>
            </label>
          </div>

          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-seats-1" type="checkbox" name="event-offer-seats">
            <label class="event__offer-label" for="event-offer-seats-1">
              <span class="event__offer-title">Choose seats</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">5</span>
            </label>
          </div>

          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-train-1" type="checkbox" name="event-offer-train">
            <label class="event__offer-label" for="event-offer-train-1">
              <span class="event__offer-title">Travel by train</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">40</span>
            </label>
          </div>
        </div>
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${name}</p>
      </section>
    </section>
  </form>`
  );
};

export default class PointEditView extends AbstractStatefulView {
  #startDatePicker = null;
  #endDatePicker = null;

  #point = null;

  constructor(point = BLANK_POINT) {
    super();
    this._state = PointEditView.parsePointToState(point);

    this.#setInnerHandlers();
    this.#setDatepicker();
  }

  get template() {
    return createPointEditTemplate(this._state);
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
  };

  #typeToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      isTypeChanged: !this._state.isTypeChanged,
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


  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('.event__save-btn').addEventListener('submit', this.#formSubmitHandler);
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

  #setDatepicker = () => {
    this.#startDatePicker = flatpickr (
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'j F',
        defaultDate: this._state.startDate,
        onChange: this.#startDateChangeHandler,
      },
    );
    this.#endDatePicker = flatpickr (
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'j F',
        defaultDate: this._state.endDate,
        onChange: this.#endDateChangeHandler,
      },
    );
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-toggle')
      .addEventListener('click', this.#typeToggleHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('click', this.#destinationInputHandler);
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

    return point;
  };
}
