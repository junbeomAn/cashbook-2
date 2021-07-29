import Component from '@/lib/Component';
import Header from '@/components/Header/Header';
import InfoBar from '@/components/InfoBar/InfoBar';
import InputBar from '@/components/InputBar/InputBar';
import HistoryContainer from '@/components/HistoryContainer/HistoryContainer';
import historyData from '@/util/tempHistory';
import './Main.scss';
import '@/pages/global.scss';

export default class Main extends Component {
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
    new Header({
      parent: this,
      keyword: 'header',
      props: {
        navigationLocation: 0,
      },
    });

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
            this.componentState = {
              selectedDate: historyData[historyIndex].date,
              selectedData: historyData[historyIndex].history[contentsIndex],
            };
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
      },
    });

    return `
    <div class="app-background">
      ${this.resolveChild('header')}
      ${this.resolveChild('input-bar')}
      <div class="main-contents-container">
        ${this.resolveChild('info-bar')}
        ${this.assembleHistoryData()}
      </div>
    </div>`;
  }
}
