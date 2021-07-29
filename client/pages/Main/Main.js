import Component from '@/lib/Component';
import Header from '@/components/Header/Header';
import Modal from '@/components/Modal/Modal';
import {
  PAYMENT_MODAL_TITLE,
  PAYMENT_MODAL_CANCEL_TEXT,
  PAYMENT_MODAL_SUBMIT_TEXT,
  PAYMENT_MODAL_PLACEHOLDER,
} from '@/util/constant';
import './Main.scss';
import '@/pages/global.scss';

export default class Main extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'main-page',
      componentState: { count: 0 },
    });
  }

  preTemplate() {
    new Header({
      parent: this,
      keyword: 'header',
    });
  }

  defineTemplate() {
    return `
    <div class="app-background">
      ${this.resolveChild('header')}
    </div>`;
  }
}
