import Component from '@/lib/Component';
import down from '@/asset/down.svg';
import saveEmpty from '@/asset/saveEmpty.png';
import { moneyFormat, getToday } from '../../util/util';
import './InputBar.scss';

export default class InputBar extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'input-bar',
    });
  }

  makeDate(selectedDate) {
    return `${selectedDate.year}${`${selectedDate.month}`.padStart(2, '0')}${
      selectedDate.day
    }`;
  }

  preTemplate() {
    this.addEvent('.dropdown-add-img', 'click', () => this.props.popUpModal());
  }

  defineTemplate() {
    const { selectedData, selectedDate } = this.props;
    let date = getToday();
    let category = '선택하세요';
    let content = '';
    let payment = '선택하세요';
    let amount = '';
    let sign = '-';
    if (selectedDate.year) {
      date = this.makeDate(selectedDate);
      category = selectedData.category;
      content = selectedData.content;
      payment = selectedData.payment;
      if (selectedData.amount > 0) {
        sign = '+';
      }
      amount = `${moneyFormat(Math.abs(selectedData.amount))}`;
    }
    return `
    <div class="input-bar-background">
      <div class="input-bar-section date-section">
        <p>일자</p>
        <input type="text" placeholder="ex ) 20210720" value=${date}>
      </div>
      <div class="input-bar-vertical-line"></div>
      <div class="input-bar-section classification-section">
        <p>분류</p>
        <div class="input-bar-dropdown-section">
          <p>${category}</p>
          <img src=${down} />
        </div>
      </div>
      <div class="input-bar-vertical-line"></div>
      <div class="input-bar-section contents-section">
        <p>내용</p>
        <input type="text" placeholder="입력하세요" value=${content}>
      </div>
      <div class="input-bar-vertical-line"></div>
      <div class="input-bar-section">
        <p>결제수단</p>
        <div class="input-bar-dropdown-section">
          <p>${payment}</p>
          <img class="dropdown-add-img" src="${down}"/>
        </div>
      </div>
      <div class="input-bar-vertical-line"></div>
      <div class="input-bar-section">
        <p>금액</p>
        <div class="input-bar-price-input">
          <p>${sign}</p>
          <input type="text" placeholder="입력하세요" value=${amount}>
          <p>원</p>
        </div>
      </div>
      <img class="input-bar-save-img" src="${saveEmpty}"/>
    </div>`;
  }
}
