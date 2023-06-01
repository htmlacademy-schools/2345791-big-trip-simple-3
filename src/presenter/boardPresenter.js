import BoardView from '../view/boardView.js';
import SortView from '../view/sortView.js';
import PointListView from '../view/pointListView';
import PointView from '../view/pointView';
import PointEditView from '../view/editPointView';
import LoadMoreButtonView from '../view/loadMoreButtonView';
import {render} from '../render.js';

export default class BoardPresenter {
  boardComponent = new BoardView();
  pointListComponent = new PointListView();

  init = (boardContainer) => {
    this.boardContainer = boardContainer;

    render(this.boardComponent, this.boardContainer);
    render(new SortView(), this.boardComponent.getElement());
    render(this.pointListComponent, this.boardComponent.getElement());
    render(new PointEditView(), this.pointListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.pointListComponent.getElement());
    }

    render(new LoadMoreButtonView(), this.boardComponent.getElement());
  };
}
