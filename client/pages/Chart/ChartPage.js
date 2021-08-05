import Component from '@/lib/Component';
import LineChart from '@/components/LineChart/LineChart';
import HistoryContainer from '@/components/HistoryContainer/HistoryContainer';
import historyData from '@/util/tempHistory';
import PieChart from '@/components/PieChart/PieChart';

import { objectToList } from '@/util/util';

import './chart.scss';
import '@/pages/global.scss';

export default class ChartPage extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'chart-page',
      componentState: {
        selectedCategory: '',
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
    this.addEvent('.pie-chart-section-container', 'click', () => {
      // TODO : Pie Chart에서 각 부분 누르면 text 전해주기.
      this.setComponentState({ selectedCategory: '식비' });
    });
  }

  defineTemplate() {
    const categoryText = this.componentState.selectedCategory;

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
    new LineChart({
      parent: this,
      keyword: 'line-chart',
      props: {
        spendData: [38900, 21020, 300010, 20300, 9400, 67000],
        spendDate: ['3', '4', '5', '6', '7', '8'],
      },
    });
    const data = [
      { item: '생활', ratio: 0.3 },
      { item: '쇼핑/뷰티', ratio: 0.25 },
      { item: '교통', ratio: 0.15 },
      { item: '문화/여가', ratio: 0.2 },
      { item: '식비', ratio: 0.1 },
    ];

    new PieChart({
      parent: this,
      keyword: 'pie-chart',
      props: {
        data,
        width: 400,
        height: 400,
      },
    });
    // const pie = PieChart(data, '480', '480');
    // console.log(pie);
    if (categoryText.length === 0) {
      return `
      <div class="pie-chart-section-container">
        ${this.resolveChild('pie-chart')}
      </div>`;
    }

    return `
    <div class="pie-chart-section-container">
      ${this.resolveChild('pie-chart')}
    </div>
    <div class="line-chart-section-container">
      <p class="line-chart-section-header">${categoryText} 카테고리 소비 추이</p>
      ${this.resolveChild('line-chart')}
    </div>
    ${this.assembleHistoryData()}
    `;
  }
}
