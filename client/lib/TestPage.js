import Component from './Component';

export default class TestPage extends Component {
  constructor(props) {
    super(props);
    // Model은 가지고 있지 않고, Controller만 가지고 있도록 한다.
    this.controller = props.controller;
    // 다만 첫 업데이트 시 Model 관련 정보도 필요하니깐, model정보도 잠깐 쓴다.
    const { initData } = this.controller.model;
    initData({
      TestPage: {
        today: '21',
        inputData: 'Please Input Data',
      },
      History: { contents: [{ price: 20000, paymentId: 2, categoryId: 3 }] },
    });

    const { modelState } = this.controller.model;

    // 만약 TestPage만의 데이터를 쓴다면?
    this.modelState = {
      TestPage: modelState.TestPage,
      History: modelState.History,
    };

    // 이런 방법도 좋긴 하지만, 아래의 코드가 모든 생성자에 들어가야 한다. 차라리 render 하기 전에 이걸 호출해주면 더 좋을듯!
    // 이 Component가 unmount 되는 시점에 해당 EventListen을 모두 끄게 되면 불필요한 업데이트도 일어나지 않는다.
    this.modelState.keys().forEach((key) => {
      this.addEventListener(key, (e) => {
        // SetState 관련 로직. prevState = this.state, nextState = e.detail.state
        this.update(this.state, e.state); // setState보다는 바뀐 props에 따라서 update하라는 logic.
        // -> 바뀐게 있으면 render를 호출
      });
    });
  }

  setTemplate() {
    const $input = new Component({ parent: this });
    $input.addEventListener('click', () => {
      console.log('event 발생'); // Event 발생시 해당 ViewState를 Binding하여 전달.
      const e = {};
      e.data = {
        inputData: `입력발생! : ${Math.floor(Math.random() * 10000)}`,
      }; // 이렇게 해도 좋지만, e.data = this.veiwState 로 전달해도 좋을 것 같다.
      // e.target = this;
      e.type = 'TestPageInputEvent';
      this.controller.emitEvent(e); // 우리가 주로 사용하는 e가 아님에 주의!
    });

    // 해보니깐 아래같은 방법은 안되더라...
    return `<div> ${$input.innerHTML} </div>`;
  }
}
