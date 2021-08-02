import CalendarPage from '@/pages/Calendar/CalendarPage';
import Main from '@/pages/Main/Main';
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
    controller
  })

  $target.append($contentsContainer);
  document.body.append($target);
  
   new Main({
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
  }
  router
    .addRoute('/history', Main, { ...defaultProps }, cleanUpPageMiddleware)
    .addRoute('/calendar', CalendarPage, { ...defaultProps }, cleanUpPageMiddleware)
    .start()

};
/*
model.initData();

controller.use('TestPageInputEvent', (e) => {
  const $temp = e.model.modelState; // auto deepcopy.
  $temp.TestPage.inputValue = e.data.inputValue;
  controller.model.setModelState($temp); // 자동으로 TestPage에 이벤트 알람이 감. model에서 일일히 불러줄 필요 없음.
  //$temp의 형태
  //{
  //  TestPage : {...},
  //  History : {}
  //}
});
*/
