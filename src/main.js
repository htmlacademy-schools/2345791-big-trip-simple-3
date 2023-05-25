import NewPointButtonView from './view/createPointView';
import FilterView from './view/filterView';
import {render} from './render.js';
import BoardPresenter from './presenter/boardPresenter';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');
const boardPresenter = new BoardPresenter();

render(new NewTaskButtonView(), siteHeaderElement);
render(new FilterView(), siteMainElement);

boardPresenter.init(siteMainElement);
