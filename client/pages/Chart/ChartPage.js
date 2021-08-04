import Component from '@/lib/Component';
import LineChart from '@/components/LineChart/LineChart';
import HistoryContainer from '@/components/HistoryContainer/HistoryContainer';
import historyData from '@/util/tempHistory';
import { objectToList } from '@/util/util';

import './chart.scss';
import '@/pages/global.scss';

export default class ChartPage extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'chart-page',
      componentState: {
        selectedCategory: '식비',
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

  filterCategoryOption(nowHistoryData) {
    const result = [];
    for (let i = 0; i < nowHistoryData.length; i += 1) {
      const nowData = {
        date: nowHistoryData[i].date,
        history: [],
        income: nowHistoryData[i].income,
        expenditure: nowHistoryData[i].expenditure,
      };
      for (const historyKey in nowHistoryData[i].history) {
        // 카테고리가 같은 경우에만 추가한다.
        if (
          nowHistoryData[i].history[historyKey].category ===
          this.componentState.selectedCategory
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
    const filteredData = this.filterCategoryOption(nowHistoryData);
    filteredData.forEach((histories, index) => {
      historyTemplate += this.resolveChild(`history-container-${index}`);
    });
    return historyTemplate;
  }

  preTemplate() {
    new LineChart({
      parent: this,
      keyword: 'line-chart',
    });
  }

  defineTemplate() {
    const categoryText = this.props.categoryText || '생활';

    const nowHistoryData = this.getNowHistoryData();
    const filteredData = this.filterCategoryOption(nowHistoryData);
    filteredData.forEach((histories, index) => {
      new HistoryContainer({
        parent: this,
        keyword: `history-container-${index}`,
        props: {
          data: histories,
          historyIndex: index,
        },
      });
    });
    return `
    <div class="line-chart-section-container">
      <p class="line-chart-section-header">${categoryText} 카테고리 소비 추이</p>
      ${this.resolveChild('line-chart')}
    </div>
    ${this.assembleHistoryData()}
    `;
  }
}
