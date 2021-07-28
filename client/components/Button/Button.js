import Component from '@/lib/Component';
import './Button.scss';

export default class Header extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'button',
      containerClass: 'smallFit',
      componentState: {
        text: params.text || '',
        textSize: params.textSize || 'small',
        imgSrc: params.imgSrc || '',
        backgroundColor: params.backgroundColor || 'transparent',
        textColor: params.textColor || 'white',
      },
    });
  }

  preTemplate() {}

  defineTemplate() {
    const { backgroundColor, imgSrc, textColor, textSize, text } =
      this.componentState;
    return `
      <button
        class="button-default button-background-${backgroundColor}" 
        style="background-image: url(${imgSrc})">
          <p class="button-text-${textColor} button-text-${textSize}">${text}</p>
      </button>
    `;
  }
}
