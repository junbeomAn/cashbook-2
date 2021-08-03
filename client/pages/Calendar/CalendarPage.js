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
    });
  }

  preTemplate() {
    new Calendar({
      parent: this,
      keyword: 'calendar',
    });
  }

  defineTemplate() {
    return `
       ${this.resolveChild('calendar')}
      `;
  }
}
