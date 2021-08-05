import Component from '@/lib/Component';
import { MODAL_ANIMATION_TIME, ALERT_OUT_TIME } from '@/util/constant';
import './Alert.scss';

export default class AlertUp extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'alert',
    });

    this.outAnimation = this.outAnimation.bind(this);
    this.timeout = setTimeout(() => {
      this.outAnimation();
    }, ALERT_OUT_TIME);
  }

  outAnimation() {
    const $container = this.querySelector('.alert-container');
    $container.classList.remove('alert-back-in');
    $container.classList.add('alert-back-out');
    // Delete me on end.
    setTimeout(() => {
      const $this = document.querySelector(`#${this.id}`);
      $this.parentNode.removeChild($this);
    }, MODAL_ANIMATION_TIME);
  }

  preTemplate() {
    this.addEvent('.alert-submit-button', 'click', async () => {
      clearTimeout(this.timeout);
      await this.outAnimation();
    });
  }

  defineTemplate() {
    const title = this.props.title || '';
    const titleColor = this.props.titleColor || '';
    const contents = this.props.contents || '';
    return `
      <div class="alert-container alert-back-in">
      <p class="alert-title-text alert-title-text-${titleColor}">${title}</p>
      <p class="alert-contents-text alert-title-text-black">${contents}</p>
        <div class="alert-button-container">
          <div class="alert-timer-background">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle class="timer-white" cx="13" cy="13" r="12" stroke="#FCFCFC"/>
            </svg>
          </div>
          <p class="alert-submit-button">확인</p>
        </div>
      </div>`;
  }
}
