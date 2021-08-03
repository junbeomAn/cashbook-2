import Component from '@/lib/Component';
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

  preTemplate() {}

  defineTemplate() {
    return `
    <div></div>
    `;
  }
}
