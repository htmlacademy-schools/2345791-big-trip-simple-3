import BoardView from '../view/boardView.js';
import SortView from '../view/sortView.js';
import PointListView from '../view/pointListView.js';
import LoadMoreButtonView from '../view/loadMoreButtonView.js';
import NoPointView from '../view/noPointView.js';
import {render, RenderPosition, remove} from '../framework/render.js';
import PointPresenter from './pointPresenter.js';
import {updateItem} from '../utils.js';
import {sortPointByDate, sortPointByPrice} from '../utils.js';
import {SortType} from '../const.js';


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
  #currentSortType = SortType.DEFAULT;
  #sourcedBoardPoints = [];

  constructor(boardContainer, pointsModel) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    this.#boardPoints = [...this.#pointsModel.points];
    this.#sourcedBoardPoints = [...this.#pointsModel.points];

    this.#renderBoard();
  };

  #handleLoadMoreButtonClick = () => {
    this.#renderPoints(this.#renderedPointCount, this.#renderedPointCount + POINT_COUNT_PER_STEP);
    this.#renderedPointCount += POINT_COUNT_PER_STEP;

    if (this.#renderedPointCount >= this.#boardPoints.length) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#sourcedBoardPoints = updateItem(this.#sourcedBoardPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.DATE:
        this.#boardPoints.sort(sortPointByDate);
        break;
      case SortType.PRICE:
        this.#boardPoints.sort(sortPointByPrice);
        break;
      case SortType.DEFAULT:
        this.#boardPoints = [...this.#sourcedBoardPoints];
    }

    this.#currentSortType = sortType;
  };


  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      this.#sortPoints(sortType.DEFAULT);
    }

    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderPointList();
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointsListComponent.element, this.#handlePointChange, this.#handleModeChange);
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
