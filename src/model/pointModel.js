import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class PointsModel extends Observable {
  #pointsApiService = null;
  #getInfoApiService = null;
  #points = [];
  #offers = [];
  #destinations = [];

  constructor(pointsApiService, getInfoApiService) {
    super();
    this.#pointsApiService = pointsApiService;
    this.#getInfoApiService = getInfoApiService;
  }

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  init = async () => {
    try {
      const offers = await this.#getInfoApiService.offers;
      this.#offers = offers;
    } catch(err) {
      this.#offers = [];
    }
    try {
      const destinations = await this.#getInfoApiService.destinations;
      this.#destinations = destinations;
    } catch(err) {
      this.#destinations = [];
    }
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
    } catch(err) {
      this.#points = [];
    }

    this._notify(UpdateType.INIT);
  };

  updatePoint = async (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update point');
    }

  };

  addPoint = async (updateType, update) => {
    try {
      const response = await this.#pointsApiService.addPoint(update);
      const newPoint = this.#adaptToClient(response);
      this.#points = [newPoint, ...this.#points];
      this._notify(updateType, newPoint);
    } catch(err) {
      throw new Error('Can\'t add point');
    }
  };

  deletePoint = async (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#pointsApiService.deletePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete point');
    }
  };

  #adaptToClient = (point) => {
    const adaptedPoint = {...point,
      price: point['base_price'],
      startDate: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      endDate: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      destination: point['destination'],
      id: point['id'],
      offers: point['offers'],
      type: point['type'],
    };
    adaptedPoint['destination'] = this.#destinations.find((destination) => {
      const neededId = adaptedPoint.destination;
      return destination.id === neededId;
    });
    const neededType = adaptedPoint.type;
    const allOffers = this.#offers.find((offer) => (offer.type === neededType)).offers;
    const neededOffers = [];
    for (let i = 0; i < adaptedPoint.offers.length; i ++) {
      const id = adaptedPoint.offers[i];
      const neededOffer = allOffers.find((offer) => offer.id === id);
      neededOffers.push(neededOffer);
    }
    adaptedPoint.offers = neededOffers;

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];

    return adaptedPoint;
  };
}
