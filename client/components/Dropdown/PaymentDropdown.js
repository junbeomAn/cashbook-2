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
          end: itemInfo.kind === '추가하기',
          text: itemInfo.kind,
          paymentColor: itemInfo.paymentColor,
          popUpPaymentModal: this.props.popUpModal,
          onDelete: (text) => {
            this.props.onDelete(text);
          },
          onClick: (text) => {
            this.props.onClick(text);
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
