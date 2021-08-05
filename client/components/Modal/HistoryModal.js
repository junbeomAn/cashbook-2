import Component from '@/lib/Component';
import categoryInfo from '@/util/category';
import {
  HISTORY_MODIFY_EVENT,
  HISTORY_DELETE_EVENT,
  MODAL_ANIMATION_TIME,
} from '@/util/constant';
import {
  objectToList,
  getAmountWithComma,
  commaAmountToNumer,
} from '@/util/util';

import model from './HistoryModalModel';
import './Modal.scss';

/**
  [ props 목록 ]
    selectedData,
    paymentColor,
    onSubmit: () => {},
    onDelete: () => {},
    onCancel: () => {},
 */
export default class HistoryModal extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'history-modal',
      componentState: {
        ...params.props.selectedData,
        paymentColor: params.props.paymentColor,
      },
      modelState: {
        payment: {
          data: [],
        },
      },
    });
    this.outAnimation = this.outAnimation.bind(this);
  }

  async outAnimation() {
    const $background = this.querySelector('.modal-background-black');
    const $container = this.querySelector('.modal-container');

    $background.classList.remove('modal-background-black-start');
    $container.classList.remove('modal-container-start');
    $background.classList.add('modal-background-black-end');
    $container.classList.add('modal-container-end');
    // Delete me on end.
    return setTimeout(() => {
      const $this = document.querySelector(`#${this.id}`);
      $this.parentNode.removeChild($this);
    }, MODAL_ANIMATION_TIME);
  }

  searchPaymentColor(payment) {
    const pData = this.modelState.payment.data;
    let paymentColor = 'grey';
    for (const key in pData) {
      if (pData[key].kind === payment) {
        paymentColor = pData[key].paymentColor;
      }
    }
    return paymentColor;
  }

  preTemplate() {
    this.addEvent('.history-modal-delete-text', 'click', async () => {
      await this.outAnimation();
      if (this.props.onDelete) {
        this.props.onDelete();
      }
    });
    this.registerControllerEvent(HISTORY_MODIFY_EVENT, model.handleModifyEvent);
    this.registerControllerEvent(HISTORY_DELETE_EVENT, model.handleDeleteEvent);

    this.addEvent('.history-modal-cancle-text', 'click', async () => {
      await this.outAnimation();
      if (this.props.onCancel) {
        this.props.onCancel();
      }
    });

    this.addEvent('.history-modal-submit-text', 'click', async () => {
      await this.outAnimation();
      if (this.props.onSubmit) {
        this.controller.emitEvent(HISTORY_MODIFY_EVENT, this.componentState);
        this.props.onSubmit();
      }
    });

    // Category Dropdown 관련 이벤트
    this.addEvent('.history-modal-drop-down-category-selector', 'click', () => {
      for (let i = 0; i < categoryInfo.length; i += 1) {
        if (categoryInfo[i].name === this.componentState.category) {
          this.setComponentState({
            category: categoryInfo[(i + 1) % categoryInfo.length].name,
            categoryColor: categoryInfo[(i + 1) % categoryInfo.length].color,
          });
          const $dest = this.querySelector('.history-modal-category-text');
          $dest.innerText = this.componentState.category;
          break;
        }
      }
    });

    // Payment Dropdown 관련 이벤트
    this.addEvent('.history-modal-drop-down-payment-selector', 'click', () => {
      const payment = objectToList(this.modelState.payment.data);
      const $colorDiv = this.querySelector('.modal-payment-color-selector');
      $colorDiv.classList.remove(
        `modal-payment-color-${this.componentState.paymentColor}`
      );

      for (let i = 0; i < payment.length; i += 1) {
        if (payment[i].kind === this.componentState.payment) {
          this.setComponentState({
            payment: payment[(i + 1) % payment.length].kind,
            paymentColor: payment[(i + 1) % payment.length].paymentColor,
          });
          const $dest = this.querySelector('.history-modal-payment-text');
          $dest.innerText = this.componentState.payment;
          $colorDiv.classList.add(
            `modal-payment-color-${this.componentState.paymentColor}`
          );
          break;
        }
      }
    });

    // Contents 관련 이벤트
    this.addEvent('.history-modal-contents-input', 'input', () => {
      const $dest = this.querySelector('.history-modal-contents-input');
      this.setComponentState({ contents: $dest.value });
    });

    // Amount 관련 이벤트
    this.addEvent('.history-modal-amount-input', 'input', () => {
      const $dest = this.querySelector('.history-modal-amount-input');
      const nextNumber = Number(commaAmountToNumer($dest.value));
      this.setComponentState({ amount: nextNumber });
      $dest.value = getAmountWithComma(nextNumber);
    });
  }

  defineTemplate() {
    const dateParse = this.componentState.date.split('T')[0];
    const splitDate = dateParse.split('-');
    const formatDate = `${splitDate[0]}년 ${splitDate[1]}월 ${splitDate[2]}일`;
    const dateText = formatDate;
    const dropdown = '바꾸려면 클릭!';
    const { category, contents, payment, amount } = this.componentState;
    const paymentClass = this.props.paymentColor || 'grey';

    return `
    <div class="modal-background-black modal-background-black-start">
      <div class="modal-container modal-container-start">
        <div class="history-modal-title-header">
          <p class="history-modal-title">다음 내역을 수정합니다.</p>
          <p class="history-modal-delete-text">삭제</p>
        </div>
        <div class="history-modal-section history-modal-section-date">
          <p class="history-modal-modify-title">일자</p>
          <p class="history-modal-plain-text">${dateText}</p>
        </div>
        <div class="history-modal-section history-modal-section-category">
          <p class="history-modal-modify-title">분류</p>
          <div class="history-modal-drop-down-container">
            <p class="history-modal-plain-text history-modal-category-text">${category}</p>

            <div class="history-modal-drop-down-selector history-modal-drop-down-category-selector">
              <p class="history-modal-dropdown-text">${dropdown}</p>
            </div>
          </div>
        </div>
        <div class="history-modal-section history-modal-section-contents">
          <p class="history-modal-modify-title">내용</p>
          <input class="history-modal-plain-text history-modal-contents-input" value="${contents}" />
        </div>
        <div class="history-modal-section history-modal-section-payment">
          <p class="history-modal-modify-title">결제수단</p>
          <div class="history-modal-drop-down-container">
            <div class="history-modal-drop-down-payment">
              <div class="modal-payment-color-selector modal-payment-color-${paymentClass}">
              </div>
              <p class="history-modal-plain-text history-modal-payment-text">${payment}</p>
            </div>
            <div class="history-modal-drop-down-selector history-modal-drop-down-payment-selector">
              <p class="history-modal-dropdown-text">${dropdown}</p>
            </div>
          </div>
        </div>
        <div class="history-modal-section history-modal-section-amount">
          <p class="history-modal-modify-title">금액</p>
          <input class="history-modal-plain-text history-modal-amount-input" value="${getAmountWithComma(
            amount
          )}" />
        </div>
        <div class="history-modal-button-container">
          <p class="history-modal-cancle-text">취소</p>
          <p class="history-modal-submit-text">수정</p>
        </div>
      </div>
    </div>`;
  }

  shouldComponentUpdate() {
    return false;
  }
}
