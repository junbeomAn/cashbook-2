import Component from '@/lib/Component';
import { getAmountWithComma } from '../../util/util';

import './Table.scss';

export default class Table extends Component {
  preTemplate() {

  }

  getLastDayOfMonth(month)  {
    month = Number(month);

    if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
      return 31;
    }
    else if (month === 2) {
      return 28;
    } else {
      return 30;
    }
  }

  createNewCell(history, historyIndex, calerdarDate) {
    if (!history) {
      return [historyIndex, `
        <div class="table-cell">
          <div class="date">${calerdarDate}</div>
        </div> 
      `];
    }

    const { date, income, expenditure } = history;
    const currentHistoryDate = new Date(date).getDate();

    
    if (currentHistoryDate === calerdarDate) {
       return [historyIndex + 1, `
        <div class="table-cell">
          <div class="date">${calerdarDate}</div>
          <div class="record">
            ${income ? `<span class="income">${getAmountWithComma(income)}</span>` : ''}
            ${expenditure ? `<span class="expenditure">${getAmountWithComma(expenditure)}</span>` : '' }
            ${income || expenditure ? `<span class="total">${getAmountWithComma(income + expenditure)}</span>` : ''}
          </div>
        </div> 
      `];
    } else {
      return [historyIndex, `
        <div class="table-cell">
          <div class="date">${calerdarDate}</div>
        </div> 
      `];
    }
  }

  makeCalendarTableWithCell() {
    const { currentMonth, currentYear, histories } = this.props;
    const firstDate = new Date(`${currentYear}-${currentMonth}-1`);
    const addDayCountFront = firstDate.getDay();
    const lastDay = this.getLastDayOfMonth(currentMonth);
    const emptyCell = `<div class='table-cell'></div>`;
    let ret = '';
    let cellCount = 0;
    let historyIndex = 0;

    for (let i = 1; i <= lastDay; i++) {
      const result = this.createNewCell(histories[historyIndex], historyIndex, i);
      historyIndex = result[0];
      ret += result[1];
      cellCount += 1;
    }
    ret = emptyCell.repeat(addDayCountFront) + ret;
    cellCount += addDayCountFront;

    if ((cellCount % 7) > 0) {
      ret += emptyCell.repeat(7 - (cellCount % 7))
    }
    return ret;
  }

  defineTemplate() {
    return `
      <div class="calendar-table">
        ${this.makeCalendarTableWithCell()}
      </div>
    `;
  }
}