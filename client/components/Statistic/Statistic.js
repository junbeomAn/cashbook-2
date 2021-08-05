import Component from '@/lib/Component';
import { moneyFormat } from '@/util/util';

import './Statistic.scss';

export default class Statistic extends Component {
  preTemplate() {}

  defineTemplate() {
    const { data, categoryColorMap } = this.props;
    return `
      <div class="statistic-container">
        <div class="total-expenditure">
          이번 달 지출 금액 ${moneyFormat(data.totalExpenditure)}
        </div>
        <ul class="statistic-list">
          ${data.list.reduce((acc, item) => {
            const {
              category = '식비',
              ratio = '0.5',
              categoryTotal = 50000,
            } = item;
            return `
              ${acc}
              <li class="stat-item">
                <div class="item-left">
                  <div class="category-name ${
                    categoryColorMap[category]
                  }">${category}</div>
                  <div class="category-occupancy">${ratio * 100}%</div>
                </div>
                <div class="sub-total">${moneyFormat(categoryTotal)}</div>
              </li>
            `;
          }, '')}
        </ul>
      </div>
    `;
  }
}
