import BoardView from '../view/boardView.js';
import SortView from '../view/sortView.js';
import PointListView from '../view/pointListView.js';
import TaskView from '../view/pointView.js';
import PointEditView from '../view/editPointView.js';
import LoadMoreButtonView from '../view/loadMoreButtonView.js';
import {render} from '../render.js';

export default class BoardPresenter {
  boardComponent = new BoardView();
  pointsListComponent = new PointListView();

  init = (boardContainer, pointsModel) => {
    this.boardContainer = boardContainer;
    this.pointsModel = pointsModel;
    this.boardPoints = [...this.pointsModel.getPoints()];

    render(this.boardComponent, this.boardContainer);
    render(new SortView(), this.boardComponent.getElement());
    render(this.taskListComponent, this.boardComponent.getElement());
    render(new PointEditView(this.boardPoints[0]), this.taskListComponent.getElement());

    for (let i = 1; i < this.boardPoints.length; i++) {
      render(new TaskView(this.boardPoints[i]), this.pointsListComponent.getElement());
    }

    render(new LoadMoreButtonView(), this.boardComponent.getElement());
  };
}
