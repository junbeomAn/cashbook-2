import Component from '../../lib/Component';
import './Test.scss';

export default class TestComponent extends Component {
  constructor(params) {
    // 생성자를 정의 할 때에는 몇가지가 필요합니다. 모두 사용하지 않아도 괜찮습니다.
    /* 1. componentName : [String] 각 Component 별 이름입니다. 비워두면 무작위 ID로 설정됩니다.
     * 2. componentState : [Object] 초기 component state의 정보입니다.
     */
    super({
      ...params,
      componentName: 'test-component',
      componentState: { count: 0 },
    });
  }

  defineTemplate() {
    // 해당 Event는 자기 자신 Component 내부에 있는 선택자만 선택합니다.
    // 따라서 Class가 많아질 때 component 여러개에 Event가 붙진 않을지 걱정하지 않아도 됩니다.
    this.addEvent('.helloText', 'click', () => {
      const { count } = this.componentState;
      this.componentState = { count: count + 1 };
    });
    return `
      <div class="container">
        <p class="helloText">HELLO WORLD ${this.componentState.count}!</p>
      </div>`;
  }
}
