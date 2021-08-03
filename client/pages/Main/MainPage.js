import Component from '@/lib/Component';
import InfoBar from '@/components/InfoBar/InfoBar';
import InputBar from '@/components/InputBar/InputBar';
import HistoryContainer from '@/components/HistoryContainer/HistoryContainer';
import historyData from '@/util/tempHistory';
import Modal from '@/components/Modal/Modal';
import LineChart from '@/components/LineChart/LineChart';
import {
  PAYMENT_MODAL_TITLE,
  PAYMENT_MODAL_CANCEL_TEXT,
  PAYMENT_MODAL_SUBMIT_TEXT,
  PAYMENT_MODAL_PLACEHOLDER,
} from '@/util/constant';
import './Main.scss';
import '@/pages/global.scss';

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

    new LineChart({
      parent: this,
      keyword: 'line-chart',
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
  }

  defineTemplate() {
    const { selectedData, selectedDate } = this.componentState;

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
    return `
      ${this.resolveChild('input-bar')}
      ${this.resolveChild('info-bar')}
      ${this.assembleHistoryData()}
      ${this.resolveChild('line-chart')}
    `;
  }
}
