import Component from '@/lib/Component';
import Dropdown from '@/components/Dropdown/Dropdown';
import PaymentDropdown from '@/components/Dropdown/PaymentDropdown';
import down from '@/asset/down.svg';
import saveEmpty from '@/asset/saveEmpty.png';
import { INPUT_DROPDOWN_ANIMATION_TIME } from '@/util/constant';
import { moneyFormat, getToday, getCategoryColor } from '@/util/util';
import './InputBar.scss';

export default class InputBar extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'input-bar',
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
    this.addEvent('.input-bar-plus-sign', 'click', () => {
      this.props.setSelectInfo({ sign: true });
    });
    this.addEvent('.input-bar-minus-sign', 'click', () => {
      this.props.setSelectInfo({ sign: false });
    });

    this.addEvent('.input-bar-save-img', 'click', () => {
      this.props.onSubmit('정보들');
    });

    // Category Dropdown 관련 이벤트
    this.addEvent('.input-bar-dropdown-section-category', 'click', () => {
      const $parent = this.querySelector('.classification-section');
      const $dropdown = $parent.querySelector('.category-drop-down-container');

      const categoryItemList = [];
      Object.keys(this.props.categoryInfo).forEach((key) => {
        categoryItemList.push(this.props.categoryInfo[key].name);
      });
      // 없을때만 붙인다.
      if (!$dropdown) {
        const dropdown = new Dropdown({
          parent: this,
          keyword: 'category-dropdown',
          props: {
            itemList: categoryItemList,
            onClick: (text) => {
              const $animator = dropdown.querySelector(
                '.drop-down-animator-down'
              );
              this.pullUp($animator, categoryItemList.length);
              const $dropdownAll = this.querySelector(`#${dropdown.id}`);
              setTimeout(() => {
                $parent.removeChild($dropdownAll);
                this.props.setSelectInfo({
                  category: text,
                  categoryColor: getCategoryColor(text),
                });
              }, INPUT_DROPDOWN_ANIMATION_TIME);
            },
          },
        });
        $parent.appendChild(dropdown.innerNode);
        const $animator = dropdown.innerNode.querySelector(
          '.classification-section .drop-down-animator-down'
        );
        this.pullDown($animator, categoryItemList.length);
      } else {
        // 있으면 없앤다.
        const $animator = $dropdown.querySelector(
          '.classification-section .drop-down-animator-down'
        );
        this.pullUp($animator, categoryItemList.length);
        setTimeout(() => {
          const dropdown = this.resolveChild('category-dropdown', false);
          const $dropdownAll = this.querySelector(`#${dropdown.id}`);
          $parent.removeChild($dropdownAll);
        }, INPUT_DROPDOWN_ANIMATION_TIME);
      }
    });

    const paymentItemList = [];
    Object.keys(this.props.payment).forEach((key) => {
      paymentItemList.push(this.props.payment[key]);
    });
    paymentItemList.push({ kind: '추가하기', paymentColor: 'none' });

    // Payment Dropdown 관련 이벤트
    this.addEvent('.input-bar-dropdown-section-payment', 'click', () => {
      const $parent = this.querySelector('.payment-section');
      const $dropdown = $parent.querySelector('.payment-drop-down-container');

      // 없을때만 붙인다.
      if (!$dropdown) {
        const dropdown = new PaymentDropdown({
          parent: this,
          keyword: 'payment-dropdown',
          props: {
            itemList: paymentItemList,
            popUpModal: this.props.popUpModal,
            onDelete: (text) => {
              this.props.onDelete(text);
            },
            onClick: (text) => {
              const $animator = dropdown.querySelector(
                '.drop-down-animator-down'
              );
              $animator.classList.toggle('drop-down-animator-down');
              this.pullUp($animator, paymentItemList.length);
              const $dropdownAll = this.querySelector(`#${dropdown.id}`);
              setTimeout(() => {
                $parent.removeChild($dropdownAll);
                this.props.setSelectInfo({
                  payment: text,
                });
              }, INPUT_DROPDOWN_ANIMATION_TIME);
            },
          },
        });
        $parent.appendChild(dropdown.innerNode);
        const $animator = dropdown.innerNode.querySelector(
          '.payment-section .drop-down-animator-down'
        );
        this.pullDown($animator, paymentItemList.length);
      } else {
        // 있으면 없앤다.
        const $animator = $dropdown.querySelector(
          '.payment-section .drop-down-animator-down'
        );
        this.pullUp($animator, paymentItemList.length);
        setTimeout(() => {
          const dropdown = this.resolveChild('payment-dropdown', false);
          const $dropdownAll = this.querySelector(`#${dropdown.id}`);
          $parent.removeChild($dropdownAll);
        }, INPUT_DROPDOWN_ANIMATION_TIME);
      }
    });
  }

  pullUp(dest, count) {
    dest.animate(
      [{ marginTop: '0px' }, { marginTop: `${-1 * count * 57}px` }],
      { duration: INPUT_DROPDOWN_ANIMATION_TIME }
    );
  }

  pullDown(dest, count) {
    dest.animate(
      [{ marginTop: `${-1 * count * 57}px` }, { marginTop: '0px' }],
      { duration: INPUT_DROPDOWN_ANIMATION_TIME }
    );
  }

  defineTemplate() {
    const { selectedData, selectedDate, selectInfo } = this.props;
    let date = getToday();
    let category = selectInfo.category || '선택하세요';
    let content = selectInfo.content || '';
    let payment = selectInfo.payment || '선택하세요';
    let amount = selectInfo.amount || '';
    let togglePlus = selectInfo.sign
      ? 'input-bar-toggle-selected'
      : 'input-bar-toggle-non-selected';
    let toggleMinus = !selectInfo.sign
      ? 'input-bar-toggle-selected'
      : 'input-bar-toggle-non-selected';
    if (selectedDate.year) {
      date = this.makeDate(selectedDate);
      category = selectedData.category;
      contents = selectedData.contents;
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
        <div class="input-bar-dropdown-section input-bar-dropdown-section-category">
          <p>${category}</p>
          <img src=${down} />
        </div>
      </div>
      <div class="input-bar-vertical-line"></div>
      <div class="input-bar-section contents-section">
        <p>내용</p>
        <input type="text" placeholder="입력하세요" value=${contents}>
      </div>
      <div class="input-bar-vertical-line"></div>
      <div class="input-bar-section payment-section">
        <p>결제수단</p>
        <div class="input-bar-dropdown-section input-bar-dropdown-section-payment">
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
      <div class="input-bar-save-container">
        <img class="input-bar-save-img" src="${saveEmpty}"/>
      </div>
    </div>`;
  }
}
