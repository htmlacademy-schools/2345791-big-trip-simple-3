import BoardView from '../view/boardView.js';
import SortView from '../view/sortView.js';
import PointListView from '../view/pointListView';
import TaskView from '../view/pointView';
import PointEditView from '../view/editPointView';
import LoadMoreButtonView from '../view/loadMoreButtonView';
import {render} from '../render.js';

export default class BoardPresenter {
  boardComponent = new BoardView();
  taskListComponent = new PointListView();

  init = (boardContainer) => {
    this.boardContainer = boardContainer;

    render(this.boardComponent, this.boardContainer);
    render(new SortView(), this.boardComponent.getElement());
    render(this.taskListComponent, this.boardComponent.getElement());
    render(new PointEditView(), this.taskListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new TaskView(), this.taskListComponent.getElement());
    }

    render(new LoadMoreButtonView(), this.boardComponent.getElement());
  };
}
