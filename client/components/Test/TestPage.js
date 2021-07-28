import Component from '../../lib/Component';
import TestComponent from './TestComponent';
import './Test.scss';

export default class TestPage extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'test-page',
      componentState: { count: 0 },
    });
  }

  preTemplate() {
    this.addEvent('.totalContainer > p', 'click', () => {
      const { count } = this.componentState;
      this.componentState = { count: count + 1 };
    });

    new TestComponent({
      parent: this,
      keyword: 'first-test-component',
    });
    new TestComponent({
      parent: this,
    });
    new TestComponent({
      parent: this,
      keyword: 'third-test-component',
    });
  }

  defineTemplate() {
    // Define Template에서 하위 Component를 사용하고 싶다면 preTemplate에서 먼저 선언해야 합니다.
    // 이후 resolveChild(${선언한 순서}) 혹은 를 통해서 찾을 수 있습니다.
    return `<div class="totalContainer">
      <p>${this.componentState.count}</p>
      <div class="testContainer">
        ${this.resolveChild('first-test-component').getTemplate()}
        ${this.resolveChild(1).getTemplate()}
        ${this.resolveChild(2).getTemplate()}
      </div>
    </div>`;
  }
}
