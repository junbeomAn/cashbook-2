import Component from '@/lib/Component';
import Dropdown from '@/components/Dropdown/Dropdown';
import PaymentDropdown from '@/components/Dropdown/PaymentDropdown';
import down from '@/asset/down.svg';
import categoryInfo from '@/util/category';
import saveEmpty from '@/asset/saveEmpty.png';
import saveChecked from '@/asset/saveChecked.png';
import AlertUp from '@/components/AlertUp/AlertUp';
import {
  INPUT_DROPDOWN_ANIMATION_TIME,
  HISTORY_ADD_EVENT,
  PAYMENT_ADD_EVENT,
  PAYMENT_DEL_EVENT,
  GET_HISTORIES_BY_DATE,
} from '@/util/constant';
import {
  getAmountWithComma,
  getToday,
  getCategoryColor,
  commaAmountToNumer,
  alertUp,
} from '@/util/util';
import model from './InputBarModel';
import './InputBar.scss';

export default class InputBar extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'input-bar',
      componentState: {
        category: '',
        categoryColor: '',
        contents: '',
        payment: '',
        amount: 0,
        sign: false,
      },
      modelState: {
        historyData: {
          data: [],
        },
        payment: {
          data: [],
        },
        date: {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
        },
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

  checkSaveAvailable() {
    try {
      let amount = this.querySelector('.input-bar-amount-input').value;
      amount = Number(commaAmountToNumer(amount));

      if (amount === 0) return false;
      if (
        !this.componentState.category ||
        this.componentState.category.length === 0
      ) {
        return false;
      }
      if (
        !this.componentState.payment ||
        this.componentState.payment.length === 0
      ) {
        return false;
      }
      return true;
    } catch (err) {}
    return false;
  }

  preTemplate() {
    this.addEvent('.input-bar-plus-sign', 'click', () => {
      this.setComponentState({ sign: true });
    });
    this.addEvent('.input-bar-minus-sign', 'click', () => {
      this.setComponentState({ sign: false });
    });
    this.registerControllerEvent(HISTORY_ADD_EVENT, model.handleDataPost);

    // Send Button Click
    this.addEvent('.input-bar-save-img', 'click', () => {
      let amount = this.querySelector('.input-bar-amount-input').value;
      amount = Number(commaAmountToNumer(amount));
      if (!this.componentState.sign) amount *= -1;

      if (this.checkSaveAvailable()) {
        this.controller.emitEvent(HISTORY_ADD_EVENT, {
          source: this.modelState.historyData.data,
          add: {
            date: `${getToday().trim()}`,
            category: this.componentState.category,
            categoryColor: this.componentState.categoryColor,
            contents: this.componentState.contents,
            payment: this.componentState.payment,
            amount,
          },
        });
        this.setComponentState({
          category: '',
          categoryColor: '',
          contents: '',
          payment: '',
          amount: 0,
          sign: false,
        });

        this.controller.emitEvent(GET_HISTORIES_BY_DATE, {
          year: this.modelState.date.year,
          month: this.modelState.date.month,
        });
      } else if (amount === 0) {
        alertUp(AlertUp, '돈은 반드시 입력해야합니다.', '돈을 입력해주세요!');
      } else if (
        !this.componentState.category ||
        this.componentState.category.length === 0
      ) {
        alertUp(
          AlertUp,
          '분류는 반드시 입력해야합니다.',
          '분류를 입력해주세요!'
        );
      } else if (
        !this.componentState.payment ||
        this.componentState.payment.length === 0
      ) {
        alertUp(
          AlertUp,
          '지불수단은 반드시 입력해야합니다.',
          '지불수단을 입력해주세요!'
        );
      }
    });

    this.addEvent('.input-bar-contents-input', 'change', () => {
      const contents = this.querySelector('.input-bar-contents-input').value;
      this.setComponentState({ contents });
    });

    this.addEvent('.input-bar-amount-input', 'change', () => {
      const amount = this.querySelector('.input-bar-amount-input').value;
      this.setComponentState({ amount });
    });

    // Category Dropdown 관련 이벤트
    this.addEvent('.input-bar-dropdown-section-category', 'click', () => {
      const $parent = this.querySelector('.classification-section');
      const $dropdown = $parent.querySelector('.category-drop-down-container');

      const categoryItemList = [];
      Object.keys(categoryInfo).forEach((key) => {
        categoryItemList.push(categoryInfo[key].name);
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
                this.setComponentState({
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

    this.registerControllerEvent(PAYMENT_ADD_EVENT, model.handleAddPayment);
    this.registerControllerEvent(PAYMENT_DEL_EVENT, model.handleDelPayment);
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
    const paymentItemList = [];
    Object.keys(this.modelState.payment.data).forEach((key) => {
      paymentItemList.push(this.modelState.payment.data[key]);
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
                this.setComponentState({
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

    const date = getToday();
    const category = this.componentState.category || '선택하세요';
    const contents = this.componentState.contents || '';
    const payment = this.componentState.payment || '선택하세요';
    const amount = this.componentState.amount || '';
    const togglePlus = this.componentState.sign
      ? 'input-bar-toggle-selected'
      : 'input-bar-toggle-non-selected';
    const toggleMinus = !this.componentState.sign
      ? 'input-bar-toggle-selected'
      : 'input-bar-toggle-non-selected';
    const sendImage = this.checkSaveAvailable() ? saveChecked : saveEmpty;
    return `
    <div class="input-bar-background">
      <div class="input-bar-section date-section">
        <p>일자</p>
        <p class="input-bar-date-text">${date}</p>
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
        <input class="input-bar-contents-input" type="text" placeholder="입력하세요" value="${contents}">
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
          <input class="input-bar-amount-input" type="text" placeholder="입력하세요" value="${getAmountWithComma(
            amount
          )}">
          <p>원</p>
        </div>
      </div>
      <div class="input-bar-save-container">
        <img class="input-bar-save-img" src="${sendImage}"/>
      </div>
    </div>`;
  }
}
