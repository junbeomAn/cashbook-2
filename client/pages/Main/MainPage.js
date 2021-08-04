import Component from '@/lib/Component';
import InfoBar from '@/components/InfoBar/InfoBar';
import InputBar from '@/components/InputBar/InputBar';
import HistoryContainer from '@/components/HistoryContainer/HistoryContainer';
import historyData from '@/util/tempHistory';
import categoryInfo from '@/util/category';
import PaymentModal from '@/components/Modal/PaymentModal';
import { objectToList } from '@/util/util';
import {
  PAYMENT_MODAL_TITLE,
  PAYMENT_MODAL_CANCEL_TEXT,
  PAYMENT_MODAL_SUBMIT_TEXT,
  PAYMENT_MODAL_PLACEHOLDER,
} from '@/util/constant';
import './Main.scss';
import arrow from '@/asset/arrow.svg';
import '@/pages/global.scss';

const PAYMENT_ADD_EVENT = 'PAYMENT_ADD_EVENT';
const PAYMENT_DEL_EVENT = 'PAYMENT_DEL_EVENT';
const HISTORY_ADD_EVENT = 'HISTORY_ADD_EVENT';

export default class MainPage extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'main-page',
      componentState: {
        selectedData: {},
        selectedDate: {},
        selectInfo: {
          category: '',
          categoryColor: '',
          content: '',
          payment: '',
          amount: 0,
          sign: false,
        },
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
        payment: {
          data: [
            { kind: '현금', paymentColor: 'red' },
            { kind: '현대카드', paymentColor: 'yellow' },
            { kind: '비씨카드', paymentColor: 'green' },
          ],
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

  preTemplate() {
    this.addEvent('.main-totop-button', 'click', () => {
      const scrollInterval = setInterval(() => {
        document.documentElement.scrollTop -= 30;
        if (document.documentElement.scrollTop <= 0) {
          clearInterval(scrollInterval);
        }
      }, 10);
    });
    this.registerControllerEvent(PAYMENT_ADD_EVENT, (addInfo) => {
      const paymentData = [];
      const { data } = this.modelState.payment;
      for (const key in data) {
        if (data[key]) {
          paymentData.push(data[key]);
        }
      }
      paymentData.push(addInfo);
      const state = { data: paymentData };
      const e = {
        state,
        key: 'payment',
      };

      return e;
    });

    this.registerControllerEvent(PAYMENT_DEL_EVENT, (deleteKey) => {
      const paymentData = this.modelState.payment.data;
      for (const key in paymentData) {
        if (paymentData[key].kind === deleteKey) {
          delete paymentData[key];
          break;
        }
      }
      const state = { data: paymentData };
      const e = {
        state,
        key: 'payment',
      };

      return e;
    });

    this.registerControllerEvent(HISTORY_ADD_EVENT, (/* addData */) => {
      /*
      const { date, history } = addData;
      const year = Number(date.subString(0, 4));
      const month = Number(date.subString(4, 6));
      const day = Number(date.subString(6, 8));
      const historyData = this.modelState.historyData.data;
      */
      console.log(this.modelState.historyData.data);
      const state = { data: this.modelState.historyData.data };
      const e = {
        state,
        key: 'historyData',
      };

      return e;
    });
  }

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

    const { selectedData, selectedDate, selectInfo } = this.componentState;

    new InputBar({
      parent: this,
      keyword: 'input-bar',
      props: {
        selectedDate,
        selectedData,
        selectInfo,
        categoryInfo,
        payment: this.modelState.payment.data,
        setSelectInfo: (data) => {
          this.setComponentState({
            selectInfo: { ...this.componentState.selectInfo, ...data },
          });
        },
        onDelete: (kind) => {
          // kind : "", paymentColor: ""
          this.controller.emitEvent(PAYMENT_DEL_EVENT, kind);
        },
        onSubmit: (data) => {
          // this.controller.emitEvent(HISTORY_ADD_EVENT, data);
          console.log(data);
          this.setComponentState({
            selectInfo: {
              category: '',
              categoryColor: '',
              content: '',
              payment: '',
              amount: 0,
              sign: false,
            },
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
                this.controller.emitEvent(PAYMENT_ADD_EVENT, data);
              },
            },
          });

          $modalParent.appendChild($modal.innerNode);
        },
      },
    });
    return `
      ${this.resolveChild('input-bar')}
      ${this.resolveChild('info-bar')}
      ${this.assembleHistoryData()}
      <div class="main-totop-button">
        <img src="${arrow}"/>
      </div>
    `;
  }
}
