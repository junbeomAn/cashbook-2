import Component from '@/lib/Component';
import leftArrow from '@/asset/left-arrow.svg';
import rightArrow from '@/asset/right-arrow.svg';
import Button from '@/components/Button/Button';
import {
  CALENDAR_NUMBER_CHANGE_ANIMATION_TIME,
  HEADER_TEXT,
  DATE_DOWN_EVENT,
  DATE_UP_EVENT,
  GET_HISTORIES_BY_DATE,
} from '@/util/constant';
import './Header.scss';
import router from '@/lib/router';
import headerModel from './headerModel';

export default class Header extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'header',
      componentState: { navigation: 0 },
      modelState: {
        date: {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
        },
        historyData: {
          data: [],
        },
      },
    });
    this.changeDate = this.changeDate.bind(this);
    this.navigateTo = this.navigateTo.bind(this);
  }

  getChangedDate(amount) {
    let { year, month } = this.modelState.date;
    month += amount;
    if (month === 0) {
      year -= 1;
      month = 12;
    } else if (month === 13) {
      year += 1;
      month = 1;
    }
    return { year, month };
  }

  changeDate(amount) {
    let { year, month } = this.modelState.date;
    const $month = this.querySelector('.header-date-month');
    const $year = this.querySelector('.header-date-year');

    month += amount;
    if (month === 0) {
      year -= 1;
      month = 12;
      $year.classList.add('date-rotate-transform');
    } else if (month === 13) {
      year += 1;
      month = 1;
      $year.classList.add('date-rotate-transform');
    }
    $month.classList.add('date-rotate-transform');

    setTimeout(() => {
      $year.classList.remove('date-rotate-transform');
      $month.classList.remove('date-rotate-transform');
    }, CALENDAR_NUMBER_CHANGE_ANIMATION_TIME);

    return { month, year };
  }

  navigateTo(index) {
    this.setComponentState({ navigation: index });
    const navigateList = [
      this.resolveChild('history', false),
      this.resolveChild('calendar', false),
      this.resolveChild('chart', false),
    ];
    navigateList.forEach((el, elIndex) => {
      if (elIndex === index) el.textOn();
      else el.textOff();
    });
  }

  componentDidUpdate() {
    const navigateList = [
      this.resolveChild('history', false),
      this.resolveChild('calendar', false),
      this.resolveChild('chart', false),
    ];
    navigateList.forEach((el, elIndex) => {
      if (elIndex === this.componentState.navigation) el.textOn();
      else el.textOff();
    });
  }

  preTemplate() {
    this.addEvent('.logo-container', 'click', () => {
      router.push('history');
      this.navigateTo(0);
    });

    const navigateHighlightLocation = this.props.navigationLocation || 0;
    const navigateText = ['내역', '달력', '통계'];
    const navigateKeyword = ['history', 'calendar', 'chart'];

    // Make 3 navigation btn
    navigateText.forEach((text, index) => {
      new Button({
        parent: this,
        keyword: navigateKeyword[index],
        props: {
          text,
          textSize: 'small',
          textColor: 'white',
          backgroundColor: 'mint',
          toggleTextColor: 'mint',
          toggleBackColor: 'white',
          highlight: navigateHighlightLocation === index,
          onClick: () => {
            router.push(navigateKeyword[index]);
            this.navigateTo(index);
          },
        },
      });
    });

    new Button({
      parent: this,
      keyword: 'left-arrow',
      props: {
        imgSrc: leftArrow,
        onClick: () => {
          this.controller.emitEvent(DATE_DOWN_EVENT);
          const changedDate = this.getChangedDate(-1);
          this.controller.emitEvent(GET_HISTORIES_BY_DATE, {
            year: changedDate.year,
            month: changedDate.month,
          });
          const $month = this.querySelector('.header-date-month');
          $month.innerText = `${changedDate.month}월`;
          const $year = this.querySelector('.header-date-year');
          $year.innerText = `${changedDate.year}`;
        },
      },
    });
    new Button({
      parent: this,
      keyword: 'right-arrow',
      props: {
        imgSrc: rightArrow,
        onClick: () => {
          this.controller.emitEvent(DATE_UP_EVENT);
          const changedDate = this.getChangedDate(1);
          this.controller.emitEvent(GET_HISTORIES_BY_DATE, {
            year: changedDate.year,
            month: changedDate.month,
          });
          const $month = this.querySelector('.header-date-month');
          $month.innerText = `${changedDate.month}월`;
          const $year = this.querySelector('.header-date-year');
          $year.innerText = `${changedDate.year}`;
        },
      },
    });

    this.registerControllerEvent(
      GET_HISTORIES_BY_DATE,
      headerModel.getHistories
    );

    this.registerControllerEvent(DATE_UP_EVENT, () => {
      const state = this.changeDate(1);
      const e = {
        state,
        key: 'date',
      };

      return e;
    });

    this.registerControllerEvent(DATE_DOWN_EVENT, () => {
      const state = this.changeDate(-1);
      const e = {
        state,
        key: 'date',
      };

      return e;
    });
  }

  defineTemplate() {
    return `
    <div class="header-container">
      <div class="header-contents-container">
        <div class="logo-container">
          <p class="logo-text">${HEADER_TEXT}</p>
        </div>
        <div class="header-total-date-container">
          ${this.resolveChild('left-arrow')}
          <div class="header-date-container">
            <p class="header-date-month">${this.modelState.date.month}월</p>
            <p class="header-date-year">${this.modelState.date.year}</p>
          </div>
          ${this.resolveChild('right-arrow')}
        </div>
        <div class="header-nav-container">
          ${this.resolveChild('history')}
          ${this.resolveChild('calendar')}
          ${this.resolveChild('chart')}
        </div>
      </div>
    </div>
    `;
  }

  shouldComponentUpdate() {
    // 필요하다면 더 자세한 비교 방법은 재정의하여 정의한다.
    return false;
    // return !deepCompare(prevState, newState);
  }
}
