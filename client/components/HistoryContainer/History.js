import Component from '@/lib/Component';
import { moneyFormat } from '@/util/util';

export default class History extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'history-contents',
    });
  }

  preTemplate() {
    this.addEvent('.history-container', 'click', () => {
      if (this.props.onModify) {
        this.props.onModify(this.props.history);
      }
    });
  }

  defineTemplate() {
    const { history } = this.props;
    return `
      <div class="history-container">
        <div class="history-category history-category-${history.categoryColor}">
          <p>${history.category}</p>
        </div>
        <p class="history-content">${history.contents}</p>
        <p class="history-payment">${history.payment}</p>
        <div class="history-amount">
          <p>${moneyFormat(history.amount)}</p>
        </div>
      </div>`;
  }
}
