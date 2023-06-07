import AbstractView from '../framework/view/abstract-view.js';

const createBoardTemplate = () => '<section class=trip-events></section>';

export default class BoardView extends AbstractView {
  #element = null;

  get template() {
    return createBoardTemplate();
  }
}
