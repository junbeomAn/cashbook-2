import Component from '@/lib/Component';
import Calendar from '@/components/Calendar/Calendar';
import historyData from '@/util/tempHistory';

import './CalendarPage.scss';
import '@/pages/global.scss';

export default class CalendarPage extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'calendar-page',
      componentState: { selectedData: {}, selectedDate: {} },
      modelState: {
        date: {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
        },
        historyData: {
          data: historyData,
        },
      },
    });
  }

  preTemplate() {}

  orderByFirstElement(a, b) {
    return Number(a[0]) - Number(b[0]);
  }

  dataObjectToArray(dataObj) {
    const arrayWithIndex = Object.entries(dataObj);
    const newArray = [...arrayWithIndex];
    newArray.sort(this.orderByFirstElement.bind(this));
    return newArray.map((item) => item[1]);
  }

  processCalendarData(data) {
    const monthData = data[0];
    const historyArr = this.dataObjectToArray(monthData.historyData);
    return historyArr.map((item) => {
      const { year, month, day } = item.date;
      return {
        ...item,
        date: `${year}-${month}-${day}`,
      };
    });
  }

  getTotalResults(data) {
    let totalIncome = 0;
    let totalExpendit = 0;
    data.forEach(({ income, expenditure }) => {
      totalIncome += income;
      totalExpendit += expenditure;
    });
    return [totalIncome, Math.abs(totalExpendit), totalIncome + totalExpendit];
  }

  defineTemplate() {
    const { data } = this.modelState.historyData;
    const newData = this.processCalendarData(data);
    const [totalIncome, totalExpenditure, sum] = this.getTotalResults(newData);
    console.log(newData);
    new Calendar({
      parent: this,
      keyword: 'calendar',
      props: {
        currentMonth: this.modelState.date.month,
        currentYear: this.modelState.date.year,
        histories: newData,
        totalIncome,
        totalExpenditure,
        sum,
      },
    });
    return `
       ${this.resolveChild('calendar')}
      `;
  }
}
