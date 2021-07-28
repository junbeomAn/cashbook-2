import Component from '../../lib/Component';
import TestComponent from './TestComponent';
import './Test.scss';

export default class TestPage extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'test-page',
      componentState: { count: 0, childCount: [0, 0, 0] },
    });
    console.log('Call Page');
  }

  preTemplate() {
    this.addEvent('.totalContainer > p', 'click', () => {
      const { count } = this.componentState;
      this.componentState = { count: count + 1 };
    });

    new TestComponent({
      parent: this,
    });
    new TestComponent({
      parent: this,
    });
    new TestComponent({
      parent: this,
    });
  }

  // innerHTML에서 Tag를 만나면 새로운 객체를 생성하는게 문제.
  defineTemplate() {
    return `<div class="totalContainer">
      <p>${this.componentState.count}</p>
      <div class="testContainer">
        ${this.resolveChild(0).getTemplate()}
        ${this.resolveChild(1).getTemplate()}
        ${this.resolveChild(2).getTemplate()}
      </div>
    </div>`;
  }
}
