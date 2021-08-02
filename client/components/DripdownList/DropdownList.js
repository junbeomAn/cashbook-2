import Component from '@/lib/Component';
import './dropdownList.scss';

export default class DropdownList extends Component {
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
    return `
      <div class="drop-down-list-container">
        <p>${this.props.text}</p>
      </div>
    `;
  }
}
