import Component from '@/lib/Component';
import closeImg from '@/asset/close.svg';
import './dropdownItem.scss';

export default class DropdownItem extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'dropdown-list',
    });
  }

  preTemplate() {
    if (this.props.onClick) {
      this.addEvent('.drop-down-list-container', 'click', () => {
        this.props.onClick(this.props.text);
      });
    }
  }

  defineTemplate() {
    const paymentColor = this.props.paymentColor || 'grey';
    const img = this.props.end ? '<div></div>' : `<img src="${closeImg}"/>`;

    return `
      <div class="payment-drop-down-list-container">
        <div class="payment-item-kind">
          <div class="payment-dropdown-color payment-dropdown-color-${paymentColor}"></div>
          <p>${this.props.text}</p>
        </div>
        ${img}
      </div>
    `;
  }
}
