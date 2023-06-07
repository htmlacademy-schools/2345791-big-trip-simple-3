import FilterView from './view/filterView';
import {render} from './framework/render.js';
import BoardPresenter from './presenter/boardPresenter';
import FilterPresenter from './presenter/filterPresenter.js';
import PointsModel from './model/pointModel';
import FilterModel from './model/filterModel.js';
import PointsApiService from './pointsApiService';
import NewPointButtonView from './view/newPointButtonView';

const AUTHORIZATION = 'Basic hS2sfS44wcl1sa2j';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const filters = [
  {
    type: 'all',
    name: 'ALL',
    count: 0,
  },
];

const siteMainElement = document.querySelector('.page-body__page-main');
const tripControls = document.querySelector('.trip-controls__filters');
const tripElement = siteMainElement.querySelector('.trip-events');
const newEventButton = document.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const boardPresenter = new BoardPresenter(tripElement, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, pointsModel);
const newPointButtonComponent = new NewPointButtonView();

render(new FilterView(filters), tripControls);

const handleNewPointFormClose = () => {
  newPointButtonComponent.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  boardPresenter.createPoint(handleNewPointFormClose);
  newPointButtonComponent.element.disabled = true;
};

newEventButton.addEventListener('click', handleNewPointButtonClick);

filterPresenter.init();
boardPresenter.init();
pointsModel.init()
  .finally(() => {
    render(newPointButtonComponent, tripControls);
    newPointButtonComponent.setClickHandler(handleNewPointButtonClick);
  });
