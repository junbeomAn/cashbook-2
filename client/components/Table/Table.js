import Component from '@/lib/Component';
import { getAmountWithComma } from '../../util/util';

import './Table.scss';

export default class Table extends Component {
  preTemplate() {}

  getLastDayOfMonth(month) {
    const $temp = Number(month);

    if ([1, 3, 5, 7, 8, 10, 12].includes($temp)) {
      return 31;
    }
    if ($temp === 2) {
      return 28;
    }
    return 30;
  }

  createNewCell(history, historyIndex, calerdarDate, isToday) {
    let todayClass = '';
    if (isToday) {
      todayClass = 'table-cell-today';
    }
    if (!history) {
      return [
        historyIndex,
        `
        <div class="table-cell ${todayClass}">
          <div class="date">${calerdarDate}</div>
        </div> 
      `,
      ];
    }

    const { date, income, expenditure } = history;
    const currentHistoryDate = new Date(date).getDate();
    if (currentHistoryDate === calerdarDate) {
      return [
        historyIndex + 1,
        `
        <div class="table-cell ${todayClass}">
          <div class="date">${calerdarDate}</div>
          <div class="record">
            ${
              income
                ? `<span class="income">${getAmountWithComma(income)}</span>`
                : ''
            }
            ${
              expenditure
                ? `<span class="expenditure">${getAmountWithComma(
                    expenditure
                  )}</span>`
                : ''
            }
            ${
              income || expenditure
                ? `<span class="total">${getAmountWithComma(
                    income + expenditure
                  )}</span>`
                : ''
            }
          </div>
        </div> 
      `,
      ];
    }
    return [
      historyIndex,
      `
        <div class="table-cell ${todayClass}">
          <div class="date">${calerdarDate}</div>
        </div> 
    `,
    ];
  }

  fillLeadingZeros(num) {
    if (num < 10) {
      return `0${num}`;
    }
    return `${num}`;
  }

  checkDateSame(today, i) {
    if (
      today.year === this.props.currentYear &&
      today.month === this.props.currentMonth &&
      today.date === i
    ) {
      return true;
    } else {
      return false;
    }
  }

  makeCalendarTableWithCell() {
    const { currentMonth, currentYear, histories } = this.props;
    const fullCurrMonth = this.fillLeadingZeros(currentMonth);
    const firstDate = new Date(`${currentYear}-${fullCurrMonth}-01`);
    const addDayCountFront = firstDate.getDay();
    const lastDay = this.getLastDayOfMonth(currentMonth);
    const emptyCell = "<div class='table-cell'></div>";
    let ret = '';
    let cellCount = 0;
    let historyIndex = 0;

    const nowDate = new Date();
    const today = {
      year: nowDate.getFullYear(),
      month: nowDate.getMonth() + 1,
      date: nowDate.getDate(),
    };

    for (let i = 1; i <= lastDay; i += 1) {
      const result = this.createNewCell(
        histories[historyIndex],
        historyIndex,
        i,
        this.checkDateSame(today, i)
      );
      [historyIndex] = result;
      ret += result[1];
      cellCount += 1;
    }
    ret = emptyCell.repeat(addDayCountFront) + ret;
    cellCount += addDayCountFront;

    if (cellCount % 7 > 0) {
      ret += emptyCell.repeat(7 - (cellCount % 7));
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
