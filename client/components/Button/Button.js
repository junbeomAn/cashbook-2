import Component from '@/lib/Component';
import './Button.scss';

export default class Button extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'button',
      containerClass: 'smallFit',
    });
  }

  toggleText() {
    if (this.props.toggleTextColor) {
      const textColor = this.props.textColor || 'white';
      const backgroundColor = this.props.backgroundColor || 'transparent';
      const textToggleColor = this.props.toggleTextColor || 'mint';
      const backgroundToggleColor = this.props.toggleBackColor || 'transparent';
      const $text = this.querySelector('.button-text');
      const $back = this.querySelector('.button-default');

      $text.classList.toggle(`button-text-${textColor}`);
      $text.classList.toggle(`button-text-${textToggleColor}`);
      $back.classList.toggle(`button-background-${backgroundColor}`);
      $back.classList.toggle(`button-background-${backgroundToggleColor}`);
    }
  }

  textOn() {
    if (this.props.toggleTextColor) {
      const textColor = this.props.textColor || 'white';
      const backgroundColor = this.props.backgroundColor || 'transparent';
      const textToggleColor = this.props.toggleTextColor || 'mint';
      const backgroundToggleColor = this.props.toggleBackColor || 'transparent';
      const $text = this.querySelector('.button-text');
      const $back = this.querySelector('.button-default');

      $text.classList.remove(`button-text-${textColor}`);
      $text.classList.add(`button-text-${textToggleColor}`);
      $back.classList.remove(`button-background-${backgroundColor}`);
      $back.classList.add(`button-background-${backgroundToggleColor}`);
    }
  }

  textOff() {
    if (this.props.toggleTextColor) {
      const textColor = this.props.textColor || 'white';
      const backgroundColor = this.props.backgroundColor || 'transparent';
      const textToggleColor = this.props.toggleTextColor || 'mint';
      const backgroundToggleColor = this.props.toggleBackColor || 'transparent';
      const $text = this.querySelector('.button-text');
      const $back = this.querySelector('.button-default');

      $text.classList.add(`button-text-${textColor}`);
      $text.classList.remove(`button-text-${textToggleColor}`);
      $back.classList.add(`button-background-${backgroundColor}`);
      $back.classList.remove(`button-background-${backgroundToggleColor}`);
    }
  }

  preTemplate() {
    if (this.props.onClick) {
      this.addEvent('button', 'click', () => this.props.onClick());
    }
  }

  defineTemplate() {
    const backgroundColor = this.props.backgroundColor || 'transparent';
    const imgSrc = this.props.imgSrc || '';
    const textColor = this.props.textColor || 'white';
    const textSize = this.props.textSize || 'small';
    const text = this.props.text || '';
    const textToggleColor = this.props.toggleTextColor || 'mint';
    const backgroundToggleColor = this.props.toggleBackColor || 'transparent';
    let textColorClass = textColor;
    let backgroundColorClass = backgroundColor;

    if (!this.isComponentMounted && this.props.highlight) {
      textColorClass = textToggleColor;
      backgroundColorClass = backgroundToggleColor;
    }

    return `
        <button
          class="button-default button-background-${backgroundColorClass}" 
          style="background-image: url(${imgSrc})">
            <p class="button-text button-text-${textColorClass} button-text-${textSize}">${text}</p>
        </button>
      `;
  }
}
