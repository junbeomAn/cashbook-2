import Component from '@/lib/Component';
import leftArrow from '@/asset/left-arrow.svg';
import rightArrow from '@/asset/right-arrow.svg';
import Button from '@/components/Button/Button';
import './Header.scss';

export default class Header extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'header',
      componentState: { year: 2021, month: 7 },
    });
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
          const nowState = this.componentState;
          let { year, month } = nowState;
          if (month === 1) {
            year -= 1;
            month = 12;
          } else {
            month -= 1;
          }
          this.componentState = { year, month };
        },
      },
    });
    new Button({
      parent: this,
      keyword: 'right-arrow',
      props: {
        imgSrc: rightArrow,
        onClick: () => {
          const nowState = this.componentState;
          let { year, month } = nowState;
          if (month === 12) {
            year += 1;
            month = 1;
          } else {
            month += 1;
          }
          this.componentState = { year, month };
        },
      },
    });
  }

  defineTemplate() {
    return `
    <div class="header-container">
      <div class="header-contents-container">
        <div class="logo-container">
          <p class="logo-text">우아한 가계부</p>
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
