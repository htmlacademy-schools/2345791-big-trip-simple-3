import BoardView from '../view/boardView.js';
import SortView from '../view/sortView.js';
import PointListView from '../view/pointListView.js';
import PointView from '../view/pointView.js';
import PointEditView from '../view/editPointView.js';
import LoadMoreButtonView from '../view/loadMoreButtonView.js';
import NoPointView from '../view/noPointView.js';
import {render} from '../framework/render.js';

const POINT_COUNT_PER_STEP = 8;

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;

  #boardComponent = new BoardView();
  #pointsListComponent = new PointListView();
  #loadMoreButtonComponent = new LoadMoreButtonView();

  #boardPoints = [];
  #renderedPointCount = POINT_COUNT_PER_STEP;

  constructor(boardContainer, pointsModel) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    this.#boardPoints = [...this.#pointsModel.getPoints()];

    this.#renderBoard();
  };

  #handleLoadMoreButtonClick = () => {
    this.#boardPoints
      .slice(this.#renderedPointCount, this.#renderedPointCount + POINT_COUNT_PER_STEP)
      .forEach((task) => this.#renderPoint(task));

    this.#renderedPointCount += POINT_COUNT_PER_STEP;

    if (this.#renderedPointCount >= this.#boardPoints.length) {
      this.#loadMoreButtonComponent.element.remove();
      this.#loadMoreButtonComponent.removeElement();
    }
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

    pointComponent.setEditClickHandler(() => {
      replaceCardToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    pointEditComponent.setFormSubmitHandler(() => {
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    pointEditComponent.setClickHandler(() => {
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(pointComponent
      , this.#pointsListComponent.element);
  };

  #renderBoard = () => {
    render(this.#boardComponent, this.#boardContainer);

    if (this.#boardPoints.every((point) => point.isArchived)) {
      render(new NoPointView(), this.#boardComponent.element);
      return;
    }

    render(new SortView(), this.#boardComponent.element);
    render(this.#pointsListComponent, this.#boardComponent.element);

    for (let i = 0; i < Math.min(this.#boardPoints.length, POINT_COUNT_PER_STEP); i++) {
      this.#renderPoint(this.#boardPoints[i]);
    }

    if (this.#boardPoints.length > POINT_COUNT_PER_STEP) {
      render(this.#loadMoreButtonComponent, this.#boardComponent.element);

      this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);
    }
  };
}
