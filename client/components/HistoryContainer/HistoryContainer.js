import Component from '@/lib/Component';
import './HistoryContainer.scss';

export default class InfoBar extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'history-container',
    });
  }

  preTemplate() {}

  calcTotal() {
    return {
      income: 50000,
      outtage: 20000,
    };
  }

  defineTemplate() {
    return `
    <div class="history-section-container">
      <div class="history-section-date-container">
        
      </div>
    </div>`;
  }
}
