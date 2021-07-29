import TestPage from './pages/Test/TestPage';
import Model from './lib/Model';
import Controller from './lib/Controller';

window.onload = () => {
  const model = new Model();
  const controller = new Controller({ model });
  new TestPage({
    parent: null,
    $target: document.body,
    controller,
  }); // View
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
