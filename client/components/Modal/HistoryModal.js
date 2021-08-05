import Component from '@/lib/Component';
import { MODAL_ANIMATION_TIME } from '@/util/constant';
import down from '@/asset/down.svg';
import './Modal.scss';

export default class HistoryModal extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'history-modal',
    });
    this.outAnimation = this.outAnimation.bind(this);
  }

  outAnimation() {
    const $background = this.querySelector('.modal-background-black');
    const $container = this.querySelector('.modal-container');

    $background.classList.remove('modal-background-black-start');
    $container.classList.remove('modal-container-start');
    $background.classList.add('modal-background-black-end');
    $container.classList.add('modal-container-end');
    // Delete me on end.
    setTimeout(() => {
      const $this = document.querySelector(`#${this.id}`);
      $this.parentNode.removeChild($this);
    }, MODAL_ANIMATION_TIME);
  }

  preTemplate() {
    this.addEvent('.modal-cancel-text', 'click', async () => {
      await this.outAnimation();
      if (this.props.onCancelClick) {
        this.props.onCancelClick();
      }
    });
  }

  defineTemplate() {
    const dateText = this.props.text || '2021년 08월 05일';
    const dropdown = '선택하세요';
    const category = this.props.category || '교통';
    const contents = this.props.contents || '후불 교통비 결제';
    const paymentClass = this.props.contents || 'yellow';
    const payment = this.props.payment || '현금';
    const amount = this.props.amount || '-45,340원';

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
            <p class="history-modal-plain-text">${category}</p>

            <div class="history-modal-drop-down-selector">
              <p class="history-modal-dropdown-text">${dropdown}</p>
              <img class="history-modal-dropdown-add-img" src="${down}"/>
            </div>
          </div>
        </div>
        <div class="history-modal-section history-modal-section-contents">
          <p class="history-modal-modify-title">내용</p>
          <input class="history-modal-plain-text" value="${contents}" />
        </div>
        <div class="history-modal-section history-modal-section-payment">
          <p class="history-modal-modify-title">결제수단</p>
          <div class="history-modal-drop-down-container">
            <div class="history-modal-drop-down-payment">
              <div class="modal-payment-color-selector modal-payment-color-${paymentClass}">
              </div>
              <p class="history-modal-plain-text">${payment}</p>
            </div>
            <div class="history-modal-drop-down-selector">
              <p class="history-modal-dropdown-text">${dropdown}</p>
              <img class="history-modal-dropdown-add-img" src="${down}"/>
            </div>
          </div>
        </div>
        <div class="history-modal-section history-modal-section-amount">
          <p class="history-modal-modify-title">금액</p>
          <input class="history-modal-plain-text" value="${amount}" />
        </div>
        <div class="history-modal-button-container">
          <p class="history-modal-cancle-text">취소</p>
          <p class="history-modal-submit-text">수정</p>
        </div>
      </div>
    </div>`;
  }
}
