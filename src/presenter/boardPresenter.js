import BoardView from '../view/boardView.js';
import SortView from '../view/sortView.js';
import PointListView from '../view/pointListView.js';
import PointView from '../view/pointView.js';
import PointEditView from '../view/editPointView.js';
import LoadMoreButtonView from '../view/loadMoreButtonView.js';
import {render} from '../render.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;

  #boardComponent = new BoardView();
  #pointsListComponent = new PointListView();

  #boardPoints = [];
  init = (boardContainer, pointsModel) => {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#boardPoints = [...this.#pointsModel.getPoints()];

    render(this.#boardComponent, this.#boardContainer);
    render(new SortView(), this.#boardComponent.element);
    render(this.#pointsListComponent, this.#boardComponent.element);

    for (let i = 0; i < this.#boardPoints.length; i++) {
      this.#renderPoint(this.#boardPoints[i]);
    }

    render(new LoadMoreButtonView(), this.#boardComponent.element);
  };

  #renderPoint = (point) => {
    const pointComponent = new PointView(point);
    const pointEditComponent = new PointEditView(point);

    const replaceCardToForm = () => {
      this.#pointsListComponent.element.replaceChild(pointEditComponent.element, pointComponent
        .element);
    };

    const replaceFormToCard = () => {
      this.#pointsListComponent.element.replaceChild(pointComponent
        .element, pointEditComponent.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceCardToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    pointEditComponent.element.querySelector('.event__save-btn').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(pointComponent
      , this.#pointsListComponent.element);
  };
}
