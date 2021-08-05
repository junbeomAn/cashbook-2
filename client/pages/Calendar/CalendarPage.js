import Component from '@/lib/Component';
import Calendar from '@/components/Calendar/Calendar';

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
      },
    });
  }

  preTemplate() {}

  defineTemplate() {
    new Calendar({
      parent: this,
      keyword: 'calendar',
      props: {
        currentMonth: this.modelState.date.month,
        currentYear: this.modelState.date.year,
        histories: [
          {
            date: '2021-07-03',
            income: 1500000,
            expenditure: -32000,
          },
          {
            date: '2021-07-08',
            income: 0,
            expenditure: -80000,
          },
        ],
      },
    });
    return `
       ${this.resolveChild('calendar')}
      `;
  }
}
