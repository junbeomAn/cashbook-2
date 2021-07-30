import Component from '@/lib/Component';
import Header from '@/components/Header/Header';
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
    new Header({
      parent: this,
      keyword: 'header',
      props: {
        navigationLocation: 0,
      },
    });

    new Calendar({
      parent: this,
      keyword: 'calendar',
    });
  }

  defineTemplate() {
    return `
    <div class="app-background">
      ${this.resolveChild('header')}
      <div class="main-contents-container">
        ${this.resolveChild('calendar')}
      </div>
    </div>`;
  }
}
