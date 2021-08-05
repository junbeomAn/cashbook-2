import arrow from '@/asset/arrow.svg';
import Component from '@/lib/Component';
import InfoBar from '@/components/InfoBar/InfoBar';
import InputBar from '@/components/InputBar/InputBar';
import HistoryContainer from '@/components/HistoryContainer/HistoryContainer';
import historyData from '@/util/tempHistory';
import PaymentModal from '@/components/Modal/PaymentModal';
import LoginModal from '@/components/Modal/LoginModal';
import HistoryModal from '@/components/Modal/HistoryModal';
import { isLogin, objectToList, needFetchHistory } from '@/util/util';
import {
  PAYMENT_MODAL_TITLE,
  PAYMENT_MODAL_CANCEL_TEXT,
  PAYMENT_MODAL_SUBMIT_TEXT,
  PAYMENT_MODAL_PLACEHOLDER,
  SET_USER_DATA,
  SET_USER_META_DATA,
  SET_HISTORY_DATA,
  LOGIN_MODAL_TITLE,
  LOGIN_MODAL_CANCEL_TEXT,
  OAUTH_CODE_SEP,
  PAYMENT_ADD_EVENT,
  PAYMENT_DEL_EVENT,
  HISTORY_ADD_EVENT,
  GET_HISTORIES_BY_DATE,
} from '@/util/constant';
import mainModel from './MainModel';

import './Main.scss';
import '@/pages/global.scss';

export default class MainPage extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'main-page',
      componentState: {
        inputToggle: true,
        outageToggle: true,
      },
      modelState: {
        date: {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
        },
        historyData: {
          data: [] /* historyData 를 빼고 빈값을 채워넣음 */,
        },
        payment: {
          data: [],
        },
        user: {
          id: '',
          nickname: localStorage.getItem('nickname') || '',
        },
      },
    });

    this.toggleInput = this.toggleInput.bind(this);
    this.toggleOutage = this.toggleOutage.bind(this);
  }

  toggleInput() {
    this.setComponentState({ inputToggle: !this.componentState.inputToggle });
  }

  toggleOutage() {
    this.setComponentState({ outageToggle: !this.componentState.outageToggle });
  }

  getNowHistoryData() {
    const { year, month } = this.modelState.date;
    const { data } = this.modelState.historyData;
    for (const key in this.modelState.historyData.data) {
      if (data[key].currentMonth === month && data[key].currentYear === year) {
        return objectToList(data[key].historyData);
      }
    }
    return [];
  }

  filterToggleOption(nowHistoryData) {
    const result = [];
    for (let i = 0; i < nowHistoryData.length; i += 1) {
      const nowData = {
        date: nowHistoryData[i].date,
        history: [],
        income: nowHistoryData[i].income,
        expenditure: nowHistoryData[i].expenditure,
      };
      for (const historyKey in nowHistoryData[i].history) {
        // 0보다 작은 입력은 outageToggle이 true일 때에만 추가한다.
        if (
          nowHistoryData[i].history[historyKey].amount <= 0 &&
          this.componentState.outageToggle
        ) {
          nowData.history.push(nowHistoryData[i].history[historyKey]);
        }

        // 0보다 작은 입력은 inputToggle이 true일 때에만 추가한다.
        if (
          nowHistoryData[i].history[historyKey].amount >= 0 &&
          this.componentState.inputToggle
        ) {
          nowData.history.push(nowHistoryData[i].history[historyKey]);
        }
      }
      if (nowData.history.length !== 0) result.push(nowData);
    }
    return result;
  }

  assembleHistoryData() {
    let historyTemplate = '';

    const nowHistoryData = this.getNowHistoryData();
    const filteredData = this.filterToggleOption(nowHistoryData);
    filteredData.forEach((histories, index) => {
      historyTemplate += this.resolveChild(`history-container-${index}`);
    });
    if (filteredData.length === 0) {
      return `
      <div class="main-empty-text-container">
        <p class="main-empty-text-first">텅</p>
        <p class="main-empty-text-second">비었어요!</p>
      </div>`;
    }
    return historyTemplate;
  }

  isLoading() {
    return window.location.search !== '';
  }

  preTemplate() {
    this.addEvent('.main-totop-button', 'click', () => {
      const scrollInterval = setInterval(() => {
        document.documentElement.scrollTop -= 30;
        if (document.documentElement.scrollTop <= 0) {
          clearInterval(scrollInterval);
        }
      }, 10);
    });

    this.registerControllerEvent(HISTORY_ADD_EVENT, (/* addData */) => {
      /*
      const { date, history } = addData;
      const year = Number(date.subString(0, 4));
      const month = Number(date.subString(4, 6));
      const day = Number(date.subString(6, 8));
      const historyData = this.modelState.historyData.data;
      */
      const state = { data: this.modelState.historyData.data };
      const e = {
        state,
        key: 'historyData',
      };

      return e;
    });

    new InputBar({
      parent: this,
      keyword: 'input-bar',
      controller: this.controller,
      props: {
        onDelete: (kind) => {
          // kind : "", paymentColor: ""
          this.controller.emitEvent(PAYMENT_DEL_EVENT, {
            source: this.modelState.payment.data,
            deleteKey: kind,
          });
        },
        popUpModal: () => {
          const $modalParent = document.querySelector('.app-background');
          const $modal = new PaymentModal({
            parent: null,
            keyword: 'payment-modal',
            props: {
              title: PAYMENT_MODAL_TITLE,
              cancelText: PAYMENT_MODAL_CANCEL_TEXT,
              submitText: PAYMENT_MODAL_SUBMIT_TEXT,
              placeholder: PAYMENT_MODAL_PLACEHOLDER,
              submitColor: 'mint',
              onSubmitClick: (data) => {
                // kind : "", paymentColor: ""
                this.controller.emitEvent(PAYMENT_ADD_EVENT, {
                  source: this.modelState.payment.data,
                  add: data,
                });
              },
            },
          });
          $modalParent.appendChild($modal.innerNode);
        },
      },
    });

    this.registerControllerEvent(SET_USER_DATA, mainModel.handleGithubLogin);
    this.registerControllerEvent(SET_USER_META_DATA, mainModel.handleMetaFetch);
    this.controller.emitEvent(SET_USER_META_DATA);
    if (!window.location.search.startsWith(OAUTH_CODE_SEP)) return;
    this.controller.emitEvent(SET_USER_DATA);
  }

  defineTemplate() {
    if (
      isLogin() &&
      needFetchHistory(this.modelState.historyData.data, this.modelState.date)
    ) {
      this.controller.emitEvent(GET_HISTORIES_BY_DATE, {
        year: this.modelState.date.year,
        month: this.modelState.date.month,
      });
    }
    let totalIncome = 0;
    let totalOutage = 0;
    let totalCount = 0;
    const nowHistoryData = this.getNowHistoryData();
    const filteredData = this.filterToggleOption(nowHistoryData);
    nowHistoryData.forEach((histories) => {
      totalIncome += histories.income;
      totalOutage += histories.expenditure;
    });
    filteredData.forEach((histories) => {
      totalCount += Object.keys(histories.history).length;
    });
    totalOutage *= -1;

    new InfoBar({
      parent: this,
      keyword: 'info-bar',
      props: {
        totalCount,
        totalIncome,
        totalOutage,
        inputToggle: this.componentState.inputToggle,
        outageToggle: this.componentState.outageToggle,
        onIncomeToggleChange: () => {
          this.toggleInput();
        },
        onOutageToggleChange: () => {
          this.toggleOutage();
        },
      },
    });

    filteredData.forEach((histories, index) => {
      new HistoryContainer({
        parent: this,
        keyword: `history-container-${index}`,
        props: {
          data: histories,
          historyIndex: index,
          onModify: (selectedData) => {
            // ID를 찾아서 던져주던가...
            const pData = this.modelState.payment.data;
            let paymentColor = 'grey';
            for (const key in pData) {
              if (pData[key].kind === selectedData.payment) {
                paymentColor = pData[key].paymentColor;
              }
            }

            const $historyModal = new HistoryModal({
              parent: null,
              props: {
                selectedData,
                paymentColor,
                onSubmit: () => {},
                onDelete: () => {},
                onCancel: () => {},
              },
            });
            const $modalParent = document.querySelector('.app-background');
            $modalParent.appendChild($historyModal.innerNode);
          },
        },
      });
    });

    this.registerControllerEvent(SET_HISTORY_DATA, async () => {
      // TODO : 더미 데이터용 아이디를 만들어서 넣어주기
      /*
      localStorage.setItem('nickname', 'sshrik');
      localStorage.setItem('userId', 2);
      */
      const state = { data: historyData };
      const e = {
        state,
        key: 'historyData',
      };

      return e;
    });

    if (!this.modelState.user.nickname && !this.isLoading()) {
      new LoginModal({
        parent: this,
        keyword: 'login-modal',
        props: {
          title: LOGIN_MODAL_TITLE,
          cancelText: LOGIN_MODAL_CANCEL_TEXT,
          onLogin: () => {
            // window.location.href = 'http://www.abc.com/';
          },
          onCancelClick: () => {
            this.controller.emitEvent(SET_HISTORY_DATA);
          },
        },
      });
    }
    let result = '';
    if (!isLogin() && !this.isLoading()) {
      result += this.resolveChild('login-modal');
    }
    return `${result}
        ${this.resolveChild('input-bar')}
        ${this.resolveChild('info-bar')}
        ${this.assembleHistoryData()}
        <div class="main-totop-button">
          <img src="${arrow}"/>
        </div>
      `;
  }
}
