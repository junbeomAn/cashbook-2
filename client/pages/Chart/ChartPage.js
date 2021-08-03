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
    return `
    ${this.resolveChild('line-chart')}
    `;
  }
}
