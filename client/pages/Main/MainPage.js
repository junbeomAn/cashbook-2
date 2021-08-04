import Component from '@/lib/Component';
import InfoBar from '@/components/InfoBar/InfoBar';
import InputBar from '@/components/InputBar/InputBar';
import HistoryContainer from '@/components/HistoryContainer/HistoryContainer';
import historyData from '@/util/tempHistory';
import Modal from '@/components/Modal/Modal';
import LoginModal from '@/components/Modal/LoginModal';
import { isLogin, objectToList } from '@/util/util';
import {
  PAYMENT_MODAL_TITLE,
  PAYMENT_MODAL_CANCEL_TEXT,
  PAYMENT_MODAL_SUBMIT_TEXT,
  PAYMENT_MODAL_PLACEHOLDER,
} from '@/util/constant';
import './Main.scss';
import '@/pages/global.scss';

const SET_HISTORY_DATA = 'SET_HISTORY_DATA';
const LOGIN_MODAL_TITLE =
  '우아한 가계부를 사용하기 위해선 로그인이 필요합니다.';
const LOGIN_MODAL_CANCEL_TEXT = '데모 계정으로 진행';

export default class MainPage extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'main-page',
      componentState: {
        selectedData: {},
        selectedDate: {},
        inputToggle: true,
        outageToggle: true,
      },
      modelState: {
        date: {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
        },
        historyData: {
          data: historyData,
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
    return historyTemplate;
  }

  preTemplate() {}

  defineTemplate() {
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
          onClick: (historyIndex, contentsIndex) => {
            this.setComponentState({
              selectedDate: nowHistoryData[historyIndex].date,
              selectedData: nowHistoryData[historyIndex].history[contentsIndex],
            });
          },
        },
      });
    });

    this.registerControllerEvent(SET_HISTORY_DATA, async () => {
      // TODO : 이 이벤트를 호출하면 History Data를 갱신.
      const state = { data: historyData };
      const e = {
        state,
        key: 'date',
      };

      return e;
    });

    const { selectedData, selectedDate } = this.componentState;
    new LoginModal({
      parent: this,
      keyword: 'login-modal',
      props: {
        title: LOGIN_MODAL_TITLE,
        cancelText: LOGIN_MODAL_CANCEL_TEXT,
        onLogin: () => {
          console.log('TODO : redirect to github login.');
          // window.location.href = 'http://www.abc.com/';
        },
        onCancelClick: () => {
          this.controller.emitEvent(SET_HISTORY_DATA);
        },
      },
    });
    new InputBar({
      parent: this,
      keyword: 'input-bar',
      props: {
        selectedDate,
        selectedData,
        popUpModal: () => {
          const $modalParent = document.querySelector('.app-background');
          const $modal = new Modal({
            parent: null,
            keyword: 'alert-modal',
            props: {
              title: PAYMENT_MODAL_TITLE,
              cancelText: PAYMENT_MODAL_CANCEL_TEXT,
              submitText: PAYMENT_MODAL_SUBMIT_TEXT,
              placeholder: PAYMENT_MODAL_PLACEHOLDER,
              submitColor: 'mint',
              onSubmitClick: (data) => {
                console.log(data);
              },
            },
          });

          $modalParent.appendChild($modal.innerNode);
        },
      },
    });
    let result = '';
    if (isLogin()) {
      result += this.resolveChild('login-modal');
    }
    return `${result}
        ${this.resolveChild('input-bar')}
        ${this.resolveChild('info-bar')}
        ${this.assembleHistoryData()}
      `;
  }
}
