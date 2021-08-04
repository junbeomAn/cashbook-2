import Component from '@/lib/Component';
import { MODAL_ANIMATION_TIME } from '@/util/constant';
import github1 from '@/asset/github/github1.png';
import './Modal.scss';

export default class Modal extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'login-modal',
    });
    this.outAnimation = this.outAnimation.bind(this);
  }

  outAnimation() {
    const $background = this.querySelector('.modal-background-black');
    const $container = this.querySelector('.modal-container');

    $background.classList.remove('modal-background-black-start');
    $container.classList.remove('modal-container-start');
    $background.classList.add('modal-background-black-end');
    $container.classList.add('modal-container-end');
    // Delete me on end.
    setTimeout(() => {
      const $this = document.querySelector(`#${this.id}`);
      $this.parentNode.removeChild($this);
    }, MODAL_ANIMATION_TIME);
  }

  preTemplate() {
    this.addEvent('.modal-cancel-text', 'click', async () => {
      await this.outAnimation();
      if (this.props.onCancelClick) {
        this.props.onCancelClick();
      }
    });
    this.addEvent('.modal-login-button', 'click', async () => {
      await this.outAnimation();
      if (this.props.onLogin) {
        this.props.onLogin();
      }
    });
  }

  defineTemplate() {
    const title = this.props.title || '';
    const cancelText = this.props.cancelText || '';
    const cancelColor = this.props.cancelColor || 'grey';
    return `
    <div class="modal-background-black modal-background-black-start">
      <div class="modal-container modal-container-start">
        <p class="modal-title-text">${title}</p>
        <button class="modal-login-button">
          <img src="${github1}"/>
          <p>GitHub으로 로그인</p>
        </button>
        <div class="modal-button-container">
          <p class="modal-cancel-text modal-cancel-text-${cancelColor}">${cancelText}</p>
        </div>
      </div>
    </div>`;
  }
}
