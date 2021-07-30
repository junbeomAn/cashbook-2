import Component from '@/lib/Component';
import toggleOn from '@/asset/toggleOn.png';
import toggleOff from '@/asset/toggleOff.png';
import { moneyFormat } from '@/util/util';

import './InfoBar.scss';

export default class InfoBar extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'input-bar',
    });
  }

  preTemplate() {
    this.addEvent('.incomeToggle', 'click', () => {
      if (this.props.onIncomeToggleChange) {
        this.props.onIncomeToggleChange();
      }
    });
    this.addEvent('.outageToggle', 'click', () => {
      if (this.props.onOutageToggleChange) {
        this.props.onOutageToggleChange();
      }
    });
  }

  defineTemplate() {
    const totalCount = this.props.totalCount || 0;
    const totalIncome = this.props.totalIncome || 0;
    const totalOutage = this.props.totalOutage || 0;
    let incomeImage = toggleOn;
    let outageImage = toggleOn;
    if (this.props.inputToggle) incomeImage = toggleOff;
    if (this.props.outageToggle) outageImage = toggleOff;

    return `
    <div class="info-bar-container">
      <p>전체 내역 ${totalCount}건<p>
      <div class="info-bar-amount-total-container">
        <div class="info-bar-amount-container">
          <img class="incomeToggle" src="${incomeImage}"/>
          <p>수입 ${moneyFormat(totalIncome)}</p>
        </div>
        <div class="info-bar-amount-container">
          <img class="outageToggle" src="${outageImage}"/>
          <p>지출 ${moneyFormat(totalOutage)}</p>
        </div>
      </div>
    </div>`;
  }
}
