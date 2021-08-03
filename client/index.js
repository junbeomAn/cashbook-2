import CalendarPage from '@/pages/Calendar/CalendarPage';
import ChartPage from '@/pages/Chart/ChartPage';
import MainPage from '@/pages/Main/MainPage';
import router from '@/lib/router';
import Model from '@/lib/Model';
import Controller from '@/lib/Controller';
import { $ } from './util/util';
import Header from './components/Header/Header';

window.onload = () => {
  const model = new Model();
  const controller = new Controller({ model });

  const $target = $.create('div');
  const $contentsContainer = $.create('div');
  $target.classList.add('app-background');
  $contentsContainer.classList.add('main-contents-container');

  new Header({
    parent: null,
    $target,
    controller,
  });

  $target.append($contentsContainer);
  document.body.append($target);

  new MainPage({
    parent: null,
    $target: $contentsContainer,
    controller,
  });
  const defaultProps = {
    parent: null,
    $target: $contentsContainer,
    controller,
  };
  const cleanUpPageMiddleware = () => {
    $contentsContainer.innerHTML = '';
    return true;
  };
  router
    .addRoute('/history', MainPage, { ...defaultProps }, cleanUpPageMiddleware)
    .addRoute(
      '/calendar',
      CalendarPage,
      { ...defaultProps },
      cleanUpPageMiddleware
    )
    .addRoute('/chart', ChartPage, { ...defaultProps }, cleanUpPageMiddleware)
    .start();
};
