import Component from '@/lib/Component';
import { moneyFormat } from '@/util/util';
import History from './History';
import './History.scss';

export default class InfoBar extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'history-container',
    });
  }

  assembleHistoryTemplate() {
    let historyTemplate = '';
    Object.keys(this.props.data.history).forEach((key) => {
      historyTemplate += this.resolveChild(`history-${key}`);
    });
    return historyTemplate;
  }

  preTemplate() {
    Object.keys(this.props.data.history).forEach((key) => {
      const history = this.props.data.history[key];
      new History({
        parent: this,
        keyword: `history-${key}`,
        props: {
          historyIndex: this.props.historyIndex,
          contentsIndex: key,
          onModify: this.props.onModify,
          history,
        },
      });
    });
  }

  defineTemplate() {
    let amountText = '';
    const { history } = this.props.data;
    let expenditure = 0;
    let income = 0;

    Object.keys(history).forEach((key) => {
      if (history[key].amount > 0) {
        income += history[key].amount;
      } else {
        expenditure += history[key].amount;
      }
    });
    if (this.props.onClick) {
      if (income !== 0) {
        amountText += `<p>수입</p><p>${moneyFormat(income)}</p>`;
      }
      if (expenditure !== 0) {
        amountText += `<p>지출</p><p>${moneyFormat(expenditure)}</p>`;
      }
    }

    return `
    <div class="history-section-container">
      <div class="history-section-info-container">
        <div class="history-section-date-container">
          <p>${this.props.data.date.month}월 ${this.props.data.date.day}일</p>
          <p>${this.props.data.date.dow}</p>
        </div>
        <div class="history-section-amount-container">
          ${amountText}
        </div>
      </div>
      ${this.assembleHistoryTemplate()}
    </div>`;
  }
}
