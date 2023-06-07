import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const NoPointsTextType = {
  [FilterType.ALL]: 'Click «ADD NEW POINT» in menu to create your first point',
  [FilterType.FUTURE]: 'There are no future points now',
};

const createNoPointTemplate = (filterType) => {
  const noPointTextValue = NoPointsTextType[filterType];
  return (
    `<p class="trip-events__msg">${noPointTextValue}</p>`
  );
};

export default class NoPointView extends AbstractView{
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointTemplate(this.#filterType);
  }
}
