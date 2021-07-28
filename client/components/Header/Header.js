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
      text: '내역',
      textSize: 'small',
      textColor: 'mint',
      backgroundColor: 'white',
    });
    new Button({
      parent: this,
      keyword: 'calendar',
      text: '달력',
      textSize: 'small',
      textColor: 'mint',
      backgroundColor: 'white',
    });
    new Button({
      parent: this,
      keyword: 'chart',
      text: '통계',
      textSize: 'small',
      textColor: 'mint',
      backgroundColor: 'white',
    });
    new Button({
      parent: this,
      keyword: 'left-arrow',
      imgSrc: leftArrow,
    });
    new Button({
      parent: this,
      keyword: 'right-arrow',
      imgSrc: rightArrow,
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
