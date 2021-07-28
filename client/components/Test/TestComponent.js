import Component from '../../lib/Component';
import './Test.scss';

export default class TestComponent extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'test-component',
      componentState: { count: 0 },
    });
  }

  defineTemplate(props) {
    this.addEvent('.helloText', 'click', () => {
      const { count } = this.componentState;
      this.componentState = { count: count + 1 };
    });
    return `
      <div class="container">
        <p class="helloText">HELLO WORLD ${props.count}!</p>
      </div>`;
  }
}
