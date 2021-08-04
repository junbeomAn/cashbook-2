import Component from '@/lib/Component';
import PaymentDropdownItem from '@/components/DropdownItem/PaymentDropdownItem';
import './dropdown.scss';

export default class Dropdown extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'dropdown',
    });
  }

  preTemplate() {
    const { itemList } = this.props;

    itemList.forEach((itemInfo, index) => {
      new PaymentDropdownItem({
        parent: this,
        keyword: `list-${index}`,
        props: {
          end: itemList.length - 1 === index,
          text: itemInfo.kind,
          paymentColor: itemInfo.paymentColor,
          onClick: (textValue) => {
            this.props.onClick(textValue);
          },
        },
      });
    });
  }

  assembleLists() {
    let result = '';
    for (let i = 0; i < this.props.itemList.length; i += 1) {
      result += this.resolveChild(`list-${i}`);
    }
    return result;
  }

  defineTemplate() {
    return `
      <div class="payment-drop-down-container">
        <div class="drop-down-animator-down">
          ${this.assembleLists()}
        </div>
      </div>
    `;
  }
}
