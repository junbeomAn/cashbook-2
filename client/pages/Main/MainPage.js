import Component from '@/lib/Component';
import InfoBar from '@/components/InfoBar/InfoBar';
import InputBar from '@/components/InputBar/InputBar';
import HistoryContainer from '@/components/HistoryContainer/HistoryContainer';
import historyData from '@/util/tempHistory';
import Modal from '@/components/Modal/Modal';
import LoginModal from '@/components/Modal/LoginModal';
import { isLogin } from '@/util/util';
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
      componentState: { selectedData: {}, selectedDate: {} },
    });
  }

  assembleHistoryData() {
    let historyTemplate = '';
    historyData.forEach((histories, index) => {
      historyTemplate += this.resolveChild(`history-container-${index}`);
    });
    return historyTemplate;
  }

  preTemplate() {
    let totalIncome = 0;
    let totalOutage = 0;
    let totalCount = 0;

    historyData.forEach((histories) => {
      totalCount += Object.keys(histories.history).length;
      totalIncome += histories.income;
      totalOutage += histories.expenditure;
    });
    totalOutage *= -1;

    new InfoBar({
      parent: this,
      keyword: 'info-bar',
      props: {
        totalCount,
        totalIncome,
        totalOutage,
      },
    });

    historyData.forEach((histories, index) => {
      new HistoryContainer({
        parent: this,
        keyword: `history-container-${index}`,
        props: {
          data: histories,
          historyIndex: index,
          onClick: (historyIndex, contentsIndex) => {
            this.setComponentState({
              selectedDate: historyData[historyIndex].date,
              selectedData: historyData[historyIndex].history[contentsIndex],
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
  }

  defineTemplate() {
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
    if (!isLogin()) {
      result += this.resolveChild('login-modal');
    }
    return `${result}
        ${this.resolveChild('input-bar')}
        ${this.resolveChild('info-bar')}
        ${this.assembleHistoryData()}
      `;
  }
}
