import Component from '../../lib/Component';
import './Test.scss';

export default class TestComponent extends Component {
  constructor(params) {
    super(params);
  }

  defineTemplate() {
    this.addEvent('input .text-input', 'input', () => {});
    return `
      <div class="container">
        <p class="helloText">HELLO WORD!</p>
      </div>`;
  }

  shouldComponentUpdate(prevState, newState) {}
}
