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
    // addEvent의 경우는 어디에서 해줘도 상관 없습니다. preTemplate, defineTemplate에서만 수행하면 됩니다.
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
    });
  }

  defineTemplate() {
    // Define Template에서 하위 Component를 사용하고 싶다면 preTemplate에서 먼저 선언해야 합니다.
    // 이후 resolveChild(${선언한 순서}) 혹은 keyword, 혹은 해당 Component의 id string을 통해서 찾을 수 있습니다.
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
