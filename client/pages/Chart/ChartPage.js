import Component from '@/lib/Component';
import LineChart from '@/components/LineChart/LineChart';

import './chart.scss';
import '@/pages/global.scss';

export default class ChartPage extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'chart-page',
      componentState: {},
    });
  }

  preTemplate() {
    new LineChart({
      parent: this,
      keyword: 'line-chart',
    });
  }

  defineTemplate() {
    const categoryText = this.props.categoryText || '생활';
    return `
    <div class="line-chart-section-container">
      <p class="line-chart-section-header">${categoryText} 카테고리 소비 추이</p>
      ${this.resolveChild('line-chart')}
    </div>
    `;
  }
}
