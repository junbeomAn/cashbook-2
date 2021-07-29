import Component from '@/lib/Component';
import leftArrow from '@/asset/left-arrow.svg';
import rightArrow from '@/asset/right-arrow.svg';
import Button from '@/components/Button/Button';
import {
  CALENDAR_NUMBER_CHANGE_ANIMATION_TIME,
  HEADER_TEXT,
} from '@/util/constant';
import './Header.scss';

export default class Header extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'header',
      componentState: { year: 2021, month: 7 },
    });
    this.changeDate = this.changeDate.bind(this);
  }

  changeDate(amount) {
    const nowState = this.componentState;
    let { year, month } = nowState;
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
      this.componentState = { year, month };
    }, CALENDAR_NUMBER_CHANGE_ANIMATION_TIME);
  }

  preTemplate() {
    new Button({
      parent: this,
      keyword: 'history',
      props: {
        text: '내역',
        textSize: 'small',
        textColor: 'mint',
        backgroundColor: 'white',
        onClick: () => {
          console.log('TODO : move to History');
        },
      },
    });
    new Button({
      parent: this,
      keyword: 'calendar',
      props: {
        text: '달력',
        textSize: 'small',
        textColor: 'mint',
        backgroundColor: 'white',
        onClick: () => {
          console.log('TODO : move to calendar');
        },
      },
    });
    new Button({
      parent: this,
      keyword: 'chart',
      props: {
        text: '통계',
        textSize: 'small',
        textColor: 'mint',
        backgroundColor: 'white',
        onClick: () => {
          console.log('TODO : move to chart');
        },
      },
    });
    new Button({
      parent: this,
      keyword: 'left-arrow',
      props: {
        imgSrc: leftArrow,
        onClick: () => {
          this.changeDate(-1);
        },
      },
    });
    new Button({
      parent: this,
      keyword: 'right-arrow',
      props: {
        imgSrc: rightArrow,
        onClick: () => {
          this.changeDate(1);
        },
      },
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
            <p class="header-date-month">${this.componentState.month}월</p>
            <p class="header-date-year">${this.componentState.year}</p>
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
}
