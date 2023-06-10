import AbstractView from '../framework/view/abstract-view.js';

const createBoardTemplate = () => `<div class="page-body__container">
<section class=trip-events>
<h2 class="visually-hidden">Trip events</h2>
</section>
</div>`;

export default class BoardView extends AbstractView {
  #element = null;

  get template() {
    return createBoardTemplate();
  }
}
