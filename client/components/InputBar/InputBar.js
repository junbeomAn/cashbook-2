import Component from '@/lib/Component';
import Dropdown from '@/components/Dropdown/Dropdown';
import down from '@/asset/down.svg';
import saveEmpty from '@/asset/saveEmpty.png';
import { INPUT_DROPDOWN_ANIMATION_TIME } from '@/util/constant';
import { moneyFormat, getToday } from '../../util/util';
import './InputBar.scss';

export default class InputBar extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'input-bar',
      componentState: {
        sign: false,
      },
    });
  }

  makeDate(selectedDate) {
    return `
    ${selectedDate.year}${`${selectedDate.month}`.padStart(
      2,
      '0'
    )}${`${selectedDate.day}`.padStart(2, '0')}`;
  }

  preTemplate() {
    this.addEvent('.dropdown-add-img', 'click', () => this.props.popUpModal());
    this.addEvent('.input-bar-plus-sign', 'click', () => {
      this.setComponentState({ sign: true });
    });
    this.addEvent('.input-bar-minus-sign', 'click', () => {
      this.setComponentState({ sign: false });
    });

    // Dropdown 관련 이벤트
    this.addEvent('.classification-section img', 'click', () => {
      const $parent = this.querySelector('.classification-section');
      const $dropdown = $parent.querySelector('.drop-down-container');

      // 없을때만 붙인다.
      if (!$dropdown) {
        const dropdown = new Dropdown({
          parent: this,
          keyword: 'category-dropdown',
          props: {
            itemList: [
              '생활',
              '식비',
              '교통',
              '쇼핑/뷰티',
              '의료/건강',
              '문화/여가',
              '미분류',
            ],
            onClick: (text) => {
              const $animator = dropdown.querySelector(
                '.drop-down-animator-down'
              );
              $animator.classList.toggle('drop-down-animator-down');
              $animator.classList.toggle('drop-down-animator-up');
              const $dropdownAll = this.querySelector(`#${dropdown.id}`);
              setTimeout(() => {
                console.log('TODO : set this to modelState : ', text);
                $parent.removeChild($dropdownAll);
              }, INPUT_DROPDOWN_ANIMATION_TIME);
            },
          },
        });
        $parent.appendChild(dropdown.innerNode);
      } else {
        // 있으면 없앤다.
        const $animator = $dropdown.querySelector('.drop-down-animator-down');
        $animator.classList.toggle('drop-down-animator-down');
        $animator.classList.toggle('drop-down-animator-up');
        setTimeout(() => {
          const dropdown = this.resolveChild('category-dropdown', false);
          const $dropdownAll = this.querySelector(`#${dropdown.id}`);
          $parent.removeChild($dropdownAll);
        }, INPUT_DROPDOWN_ANIMATION_TIME);
      }
    });
  }

  defineTemplate() {
    const { selectedData, selectedDate } = this.props;
    let date = getToday();
    let category = '선택하세요';
    let content = '';
    let payment = '선택하세요';
    let amount = '';
    let togglePlus = this.componentState.sign
      ? 'input-bar-toggle-selected'
      : 'input-bar-toggle-non-selected';
    let toggleMinus = !this.componentState.sign
      ? 'input-bar-toggle-selected'
      : 'input-bar-toggle-non-selected';
    if (selectedDate.year) {
      date = this.makeDate(selectedDate);
      category = selectedData.category;
      content = selectedData.content;
      payment = selectedData.payment;
      if (selectedData.amount > 0) {
        togglePlus = 'input-bar-toggle-selected';
        toggleMinus = 'input-bar-toggle-non-selected';
      } else {
        togglePlus = 'input-bar-toggle-non-selected';
        toggleMinus = 'input-bar-toggle-selected';
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
          <div class="input-bar-toggle-sign-container">
            <div class="input-bar-plus-sign ${togglePlus}">
              <p> + </p>
            </div>
            <div class="input-bar-minus-sign ${toggleMinus}">
              <p> - </p>
            </div>
          </div>
          <input type="text" placeholder="입력하세요" value=${amount}>
          <p>원</p>
        </div>
      </div>
      <img class="input-bar-save-img" src="${saveEmpty}"/>
    </div>`;
  }
}
