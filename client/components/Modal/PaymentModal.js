import Component from '@/lib/Component';
import { MODAL_ANIMATION_TIME } from '@/util/constant';
import './Modal.scss';

export default class Modal extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'modal',
      componentState: { color: '' },
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
    this.addEvent('.modal-submit-text', 'click', async () => {
      const inputValue = this.querySelector('.modal-input').value;
      await this.outAnimation();
      if (this.props.onSubmitClick) {
        this.props.onSubmitClick({
          inputValue,
          color: this.componentState.color,
        });
      }
    });
    this.addEvent('.modal-payment-color-selector', 'click', (e) => {
      const $dest = e.target;
      const classToken = $dest.classList[1].split('-');
      const color = classToken[classToken.length - 1];
      const $alreadyClicked = this.querySelector(
        '.modal-payment-color-selected'
      );
      if (this.componentState.color !== color) {
        this.setComponentState({ color });
        if ($alreadyClicked) {
          $alreadyClicked.classList.toggle('modal-payment-color-selected');
        }
      } else {
        this.setComponentState({ color: 'grey' });
      }
      $dest.classList.toggle('modal-payment-color-selected');
    });
  }

  defineTemplate() {
    const title = this.props.title || '';
    const cancelText = this.props.cancelText || '';
    const submitText = this.props.submitText || '';
    const placeholder = this.props.placeholder || '';
    const cancelColor = this.props.cancelColor || 'grey';
    const submitColor = this.props.submitColor || 'mint';
    const defaultValue = this.props.defaultValue || '';
    return `
    <div class="modal-background-black modal-background-black-start">
      <div class="modal-container modal-container-start">
        <p class="modal-title-text">${title}</p>
        <input class="modal-input" type="text" value="${defaultValue}" placeholder=${placeholder}>
        <div class="modal-payment-color-container">
          <div class="modal-payment-color-selector modal-payment-color-red"></div>
          <div class="modal-payment-color-selector modal-payment-color-orange"></div>
          <div class="modal-payment-color-selector modal-payment-color-yellow"></div>
          <div class="modal-payment-color-selector modal-payment-color-green"></div>
          <div class="modal-payment-color-selector modal-payment-color-blue"></div>
          <div class="modal-payment-color-selector modal-payment-color-purple"></div>
          <div class="modal-payment-color-selector modal-payment-color-grey"></div>
        </div>
        <div class="modal-button-container">
          <p class="modal-cancel-text modal-cancel-text-${cancelColor}">${cancelText}</p>
          <p class="modal-submit-text modal-submit-text-${submitColor}">${submitText}</p>
        </div>
      </div>
    </div>`;
  }

  shouldComponentUpdate() {
    return false;
  }
}
