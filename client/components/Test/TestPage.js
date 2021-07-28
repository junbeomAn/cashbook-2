import Component from '../../lib/Component';
import TestComponent from './TestComponent';
import './Test.scss';

export default class TestPage extends Component {
  defineTemplate() {
    const $testComponent1 = new TestComponent({
      parent: this,
    }).getTemplate();
    const $testComponent2 = new TestComponent({
      parent: this,
    }).getTemplate();
    const $testComponent3 = new TestComponent({
      parent: this,
    }).getTemplate();
    return `<div class="totalContainer">
      ${$testComponent1}
      ${$testComponent2}
      ${$testComponent3}
    </div>`;
  }
}
