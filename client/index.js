import TestPage from './components/Test/TestPage';
import TestComponent from './components/Test/TestComponent';
import Model from './lib/Model';
import Controller from './lib/Controller';
// 위의 Component를 상속받은 Class를 사용하려면 다음의 등록과정이 반드시 필요합니다.
// customElements.define('component-com', Component); // "-" 가 반드시 포함된 이름이어야 합니다.
// 그러나 2번 실행하면 오류가 생기므로, 반드시 모든 파일에서 1회만 수행되어야 합니다.

let componentName = 'test-component';
customElements.define(componentName, TestComponent);
componentName = 'test-page';
customElements.define(componentName, TestPage);

const model = new Model();
const controller = new Controller({ model });
const $TestPage = new TestPage({ parent: document.body, controller }); // View

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

window.onload = () => {
  $TestPage.registerPage();
};
