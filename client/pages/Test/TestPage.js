import Component from '@/lib/Component';
import Header from '@/components/Header/Header';
import Modal from '@/components/Modal/Modal';
import TestComponent from '@/components/Test/TestComponent';
import {
  PAYMENT_MODAL_TITLE,
  PAYMENT_MODAL_CANCEL_TEXT,
  PAYMENT_MODAL_SUBMIT_TEXT,
  PAYMENT_MODAL_PLACEHOLDER,
} from '@/util/constant';
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
    // 만약 defineTemplate에 addEvent를 하면 template을 다시 만들 때 마다 event가 추가되지만,
    // 중복으로 추가한 것은 무시하게 개발되었습니다.
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
    new Header({
      parent: this,
    });
  }

  defineTemplate() {
    // Define Template에서 하위 Component를 사용하고 싶다면 preTemplate에서 먼저 선언해야 합니다.
    // 이후 resolveChild(${선언한 순서}) 혹은 keyword, 혹은 해당 Component의 id string을 통해서 찾을 수 있습니다.
    new Modal({
      parent: this,
      keyword: 'alert-modal',
      props: {
        title: PAYMENT_MODAL_TITLE,
        cancelText: PAYMENT_MODAL_CANCEL_TEXT,
        submitText: PAYMENT_MODAL_SUBMIT_TEXT,
        placeholder: PAYMENT_MODAL_PLACEHOLDER,
      },
    }); // 모달을 재사용할 경우는 많지 않겠지만, 재사용하는 경우 input을 비워서 재사용해야하게 때문에 여기에 생성합니다.

    // 여기선 Modal을 바로 띄워줬지만, modal 같은 경우는 동적으로 app 사용중에 가운데 DOM API를 사용해 끼워넣는편이 좋아보입니다.
    return `<div class="totalContainer">
      ${this.resolveChild('alert-modal')}
      <p>${this.componentState.count}</p>
      ${this.resolveChild(3)}
      <div class="testContainer">
        ${this.resolveChild('first-test-component')}
        ${this.resolveChild(1)}
        ${this.resolveChild(2)}
      </div>
    </div>`;
  }
}
