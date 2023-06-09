import BoardView from '../view/boardView.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import SortView from '../view/sortView.js';
import PointListView from '../view/pointListView.js';
import LoadMoreButtonView from '../view/loadMoreButtonView.js';
import NoPointView from '../view/noPointView.js';
import {render, RenderPosition, remove} from '../framework/render.js';
import PointPresenter from './pointPresenter.js';
import {sortPointByDate, sortPointByPrice} from '../utils.js';
import {filter} from '../utils.js';
import {SortType, UserAction, UpdateType, FilterType} from '../const.js';
import NewPointPresenter from './newPointPresenter.js';
import LoadingView from '../view/loadingView.js';


const POINT_COUNT_PER_STEP = 8;
const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #boardComponent = new BoardView();
  #pointsListComponent = new PointListView();
  #loadingComponent = new LoadingView();
  #noPointComponent = null;
  #sortComponent = null;
  #loadMoreButtonComponent = null;

  #renderedPointCount = POINT_COUNT_PER_STEP;
  #pointPresenter = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(boardContainer, pointsModel, filterModel) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter(this.#pointsListComponent.element, this.#handleViewAction);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType.toLowerCase()) {
      case SortType.DATE:
        return filteredPoints.sort(sortPointByDate);
      case SortType.PRICE:
        return filteredPoints.sort(sortPointByPrice);
    }
    return filteredPoints;
  }

  get filterType() {
    return this.#filterType;
  }

  get offers() {
    const offers = this.#pointsModel.offers;
    return offers;
  }

  get currentSortType() {
    return this.#currentSortType;
  }

  init = () => {
    this.#renderBoard();
  };

  createPoint = (callback) => {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init(callback, this.#pointsModel.offers, this.#pointsModel.destinations);
  };

  #handleLoadMoreButtonClick = () => {
    const pointCount = this.points.length;
    const newRenderedPointCount = Math.min(pointCount, this.#renderedPointCount + POINT_COUNT_PER_STEP);
    const points = this.points.slice(this.#renderedPointCount, newRenderedPointCount);

    this.#renderPoints(points);
    this.#renderedPointCount = newRenderedPointCount;

    if (this.#renderedPointCount >= pointCount) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data, this.#pointsModel.offers, this.#pointsModel.destinations);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedPointCount: true, resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType.toLowerCase() === sortType.toLowerCase()) {
      this.#currentSortType = SortType.DEFAULT;
    } else {
      this.#currentSortType = sortType;
    }
    this.#clearBoard({resetRenderedPointCount: true});
    this.#renderBoard();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#sortComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointsListComponent.element, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point, this.#pointsModel.offers, this.#pointsModel.destinations);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = (points) => {
    points.forEach((point) => this.#renderPoint(point));
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderNoPoints = () => {
    this.#noPointComponent = new NoPointView(this.#filterType);
    render(this.#noPointComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderLoadMoreButton = () => {
    this.#loadMoreButtonComponent = new LoadMoreButtonView();
    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);

    render(this.#loadMoreButtonComponent, this.#boardComponent.element);
  };

  #clearBoard = ({resetRenderedPointCount = false, resetSortType = false} = {}) => {
    const pointCount = this.points.length;

    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.delete());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#loadMoreButtonComponent);

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetRenderedPointCount) {
      this.#renderedPointCount = POINT_COUNT_PER_STEP;
    } else {
      this.#renderedPointCount = Math.min(pointCount, this.#renderedPointCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderBoard = () => {
    render(this.#boardComponent, this.#boardContainer);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const points = this.points;
    const pointCount = points.length;

    if (pointCount === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    render(this.#pointsListComponent, this.#boardComponent.element);

    this.#renderPoints(points.slice(0, Math.min(pointCount, this.#renderedPointCount)));

    if (pointCount > this.#renderedPointCount) {
      this.#renderLoadMoreButton();
    }
  };
}
