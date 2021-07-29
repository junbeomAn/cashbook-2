import Component from '@/lib/Component';
import './Button.scss';

export default class Header extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'button',
      containerClass: 'smallFit',
    });
  }

  preTemplate() {
    if (this.props.onClick) {
      this.addEvent('button', 'click', this.props.onClick);
    }
  }

  defineTemplate() {
    const backgroundColor = this.props.backgroundColor || 'transparent';
    const imgSrc = this.props.imgSrc || '';
    const textColor = this.props.textColor || 'white';
    const textSize = this.props.textColor || 'small';
    const text = this.props.textColor || '';
    return `
      <button
        class="button-default button-background-${backgroundColor}" 
        style="background-image: url(${imgSrc})">
          <p class="button-text-${textColor} button-text-${textSize}">${text}</p>
      </button>
    `;
  }
}
