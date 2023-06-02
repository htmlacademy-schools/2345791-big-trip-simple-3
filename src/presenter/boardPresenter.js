import BoardView from '../view/boardView.js';
import SortView from '../view/sortView.js';
import PointListView from '../view/pointListView.js';
import LoadMoreButtonView from '../view/loadMoreButtonView.js';
import NoPointView from '../view/noPointView.js';
import {render, RenderPosition, remove} from '../framework/render.js';
import PointPresenter from './pointPresenter.js';


const POINT_COUNT_PER_STEP = 8;

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;

  #boardComponent = new BoardView();
  #pointsListComponent = new PointListView();
  #loadMoreButtonComponent = new LoadMoreButtonView();
  #sortComponent = new SortView();
  #noPointComponent = new NoPointView();

  #boardPoints = [];
  #renderedPointCount = POINT_COUNT_PER_STEP;
  #pointPresenter = new Map();

  constructor(boardContainer, pointsModel) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    this.#boardPoints = [...this.#pointsModel.points];

    this.#renderBoard();
  };

  #handleLoadMoreButtonClick = () => {
    this.#renderPoints(this.#renderedPointCount, this.#renderedPointCount + POINT_COUNT_PER_STEP);
    this.#renderedPointCount += POINT_COUNT_PER_STEP;

    if (this.#renderedPointCount >= this.#boardPoints.length) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointsListComponent.element);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = (from, to) => {
    this.#boardPoints
      .slice(from, to)
      .forEach((point) => this.#renderPoint(point));
  };

  #renderNoPoints = () => {
    render(this.#noPointComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderLoadMoreButton = () => {
    render(this.#loadMoreButtonComponent, this.#boardComponent.element);

    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);
  };

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.delete());
    this.#pointPresenter.clear();
    this.#renderedPointCount = POINT_COUNT_PER_STEP;
    remove(this.#loadMoreButtonComponent);
  };

  #renderPointList = () => {
    render(this.#pointsListComponent, this.#boardComponent.element);
    this.#renderPoints(0, Math.min(this.#boardPoints.length, POINT_COUNT_PER_STEP));
    if (this.#boardPoints.length > POINT_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
  };


  #renderBoard = () => {
    render(this.#boardComponent, this.#boardContainer);

    if (this.#boardPoints.every((point) => point.isArchived)) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPointList();
  };
}
