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
        currentMonth: 7,
        currentYear: 2021,
        histories: [{
          date: '2021-07-03',
          income: 1500000,
          expenditure: -32000
        }, {
          date: '2021-07-08',
          income: 0,
          expenditure: -80000
        }]
      }
    })
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
            <span>총 수입: ${getAmountWithComma(mockIncome)}</span>
            <span>총 지출: ${getAmountWithComma(mockExpendit)}</span>
          </div>
          <div class="right">총계: ${getAmountWithComma(mockTotal)}</div>
        </div>
      </section>
    `;
  }
}