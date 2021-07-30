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
          onClick: this.props.onClick,
          history,
        },
      });
    });
  }

  defineTemplate() {
    let amountText = '';
    if (this.props.data.income !== 0) {
      amountText += `<p>수입</p><p>${moneyFormat(this.props.data.income)}</p>`;
    }
    if (this.props.data.expenditure !== 0) {
      amountText += `<p>지출</p><p>${moneyFormat(
        this.props.data.expenditure
      )}</p>`;
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
