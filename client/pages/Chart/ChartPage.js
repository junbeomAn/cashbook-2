import Component from '@/lib/Component';
import LineChart from '@/components/LineChart/LineChart';
import HistoryContainer from '@/components/HistoryContainer/HistoryContainer';
import historyData from '@/util/tempHistory';
import PieChart from '@/components/PieChart/PieChart';
import Statistic from '@/components/Statistic/Statistic';
import { objectToList } from '@/util/util';
import { GET_LINE_CHART_DATA, PIE_CHART_SIZE } from '@/util/constant';
import chartModel from './chartModel';

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
        lineChartData: {
          monthTotalList: [],
          monthList: [],
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

  getStatisticData(data) {
    let totalExpenditure = 0;
    const categorySum = {};
    const categoryColorMap = {};

    const dataObjs = Object.values(data);
    dataObjs.forEach((dataByDate) => {
      totalExpenditure += dataByDate.expenditure;
      const historyValues = Object.values(dataByDate.history);
      historyValues.forEach(({ category, categoryColor, amount }) => {
        if (categorySum[category]) {
          categorySum[category] += amount < 0 ? amount : 0;
        } else {
          categorySum[category] = amount < 0 ? amount : 0;
        }
        categoryColorMap[category] = categoryColor;
      });
    });
    const result = this.addRatioData(categorySum, totalExpenditure);
    const sortedCategorySum = this.sortStatisticByRatio(result);

    return {
      totalExpenditure,
      categorySum: sortedCategorySum,
      categoryColorMap,
    };
  }

  addRatioData(categorySum, total) {
    const result = [];
    Object.entries(categorySum).forEach(([key, value]) => {
      const item = {};
      item.category = key;
      item.ratio = Number(Math.abs(value / total).toFixed(1));
      item.categoryTotal = value;
      result.push(item);
    });
    return result;
  }

  sortStatisticByRatio(data) {
    const result = [...data];
    result.sort((a, b) => b.ratio - a.ratio);
    return result;
  }

  lineChartObjectToList(lineChartData) {
    const spendData = Object.values(lineChartData.monthTotalList).map(Number);
    const spendDate = Object.values(lineChartData.monthList).map(Number);
    return { spendData, spendDate };
  }

  preTemplate() {
    this.registerControllerEvent(
      GET_LINE_CHART_DATA,
      chartModel.getLineChartData
    );
    this.addEvent('.pie-chart-section-container', 'click', async (e) => {
      // TODO : Pie Chart에서 각 부분 누르면 text 전해주기.
      if (!e.target.closest('.stat-item')) return;
      const $statListItem = e.target.closest('.stat-item');
      const $categoryName = $statListItem.querySelector('.category-name');
      const [_, categoryClass] = $categoryName.classList;
      const categoryId = categoryClass.split('-')[1];
      const category = $categoryName.innerText;
      const { year, month } = this.modelState.date;
      await this.controller.emitEvent(GET_LINE_CHART_DATA, {
        year,
        month,
        categoryId,
      });
      this.setComponentState({ selectedCategory: category });
    });
  }

  defineTemplate() {
    const categoryText = this.componentState.selectedCategory;

    const nowHistoryData = this.getNowHistoryData();
    const monthData = this.modelState.historyData.data[0];
    const { categoryColorMap, categorySum, totalExpenditure } =
      this.getStatisticData(monthData.historyData);
    const { lineChartData } = this.modelState;
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
    const { spendData, spendDate } = this.lineChartObjectToList(lineChartData);

    new LineChart({
      parent: this,
      keyword: 'line-chart',
      props: {
        spendData,
        spendDate,
      },
    });

    new PieChart({
      parent: this,
      keyword: 'pie-chart',
      props: {
        data: categorySum,
        width: PIE_CHART_SIZE,
        height: PIE_CHART_SIZE,
      },
    });
    new Statistic({
      parent: this,
      keyword: 'statistic',
      props: {
        data: {
          list: categorySum,
          totalExpenditure,
        },
        categoryColorMap,
      },
    });

    if (categoryText.length === 0) {
      return `
      <div class="pie-chart-section-container">
        ${this.resolveChild('pie-chart')}
        ${this.resolveChild('statistic')}
      </div>`;
    }

    return `
    <div class="pie-chart-section-container">
      ${this.resolveChild('pie-chart')}
      ${this.resolveChild('statistic')}
    </div>
    <div class="line-chart-section-container">
      <p class="line-chart-section-header">${categoryText} 카테고리 소비 추이</p>
      ${this.resolveChild('line-chart')}
    </div>
    ${this.assembleHistoryData()}
    `;
  }
}
