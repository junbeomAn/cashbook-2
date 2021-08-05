import Component from '@/lib/Component';
import { getAmountWithComma } from '../../util/util';
import Table from '../Table/Table';

import './Calendar.scss';

export default class Calendar extends Component {
  preTemplate() {
    new Table({
      parent: this,
      keyword: 'table',
      props: {
        currentMonth: this.props.currentMonth,
        currentYear: this.props.currentYear,
        histories: this.props.histories,
      },
    });
  }

  defineTemplate() {
    const mockIncome = 1822480;
    const mockExpendit = 834640;
    const mockTotal = 987840;
    return `
      <section class="cashbook-calendar">
        <div class="calendar-day-bar">
          <div class="day">일</div>
          <div class="day">월</div>
          <div class="day">화</div>
          <div class="day">수</div>
          <div class="day">목</div>
          <div class="day">금</div>
          <div class="day">토</div>
        </div>
        ${this.resolveChild('table')}
        <div class="calendar-total">
          <div class="left">
            <p>총 수입: ${getAmountWithComma(mockIncome)}</p>
            <p>총 지출: ${getAmountWithComma(mockExpendit)}</p>
          </div>
          <p class="right">총계: ${getAmountWithComma(mockTotal)}</p>
        </div>
      </section>
    `;
  }
}
