import Component from '@/lib/Component';
import DropdownItem from '@/components/DropdownItem/DropdownItem';
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

    itemList.forEach((text, index) => {
      new DropdownItem({
        parent: this,
        keyword: `list-${index}`,
        props: {
          text,
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
      <div class="drop-down-container">
        <div class="drop-down-animator-down">
          ${this.assembleLists()}
        </div>
      </div>
    `;
  }
}
