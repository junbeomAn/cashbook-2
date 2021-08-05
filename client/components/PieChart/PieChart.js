import { COLOR_CONSTANT, PIE_CHART_TRANSITION_WAIT } from '@/util/constant';

import './PieChart.scss';
/**
 * data: []
 * [
 *  { item: '생활', ratio: 0.40 },
 * { item: '카페/식사', ratio: 0.25 },
 * { item: '주거', ratio: 0.15 },
 * { item: '통신', ratio: 0.2}
 *
 * ]
 */

// const data = [
//   { item: '생활', ratio: 0.3 },
//   { item: '쇼핑/뷰티', ratio: 0.25 },
//   { item: '교통', ratio: 0.15 },
//   { item: '문화/여가', ratio: 0.2 },
//   { item: '식비', ratio: 0.1 },
// ];

// const svg = initPieChart(data, '480', '480');

import Component from '@/lib/Component';

const {
  CATEGORY_7,
  CATEGORY_4,
  CATEGORY_3,
  CATEGORY_2,
  CATEGORY_1,
  CATEGORY_5,
  CATEGORY_6,
  CATEGORY_8,
  CATEGORY_9,
  CATEGORY_10,
} = COLOR_CONSTANT;

const colorTable = {
  생활: CATEGORY_7,
  식비: CATEGORY_4,
  교통: CATEGORY_3,
  '쇼핑/뷰티': CATEGORY_2,
  '의료/건강': CATEGORY_1,
  '문화/여가': CATEGORY_5,
  미분류: CATEGORY_6,
  월급: CATEGORY_8,
  용돈: CATEGORY_9,
  기타수입: CATEGORY_10,
};

class PieChart extends Component {
  preTemplate() {}

  defineTemplate() {
    const { width, height, data } = this.props;
    const r = width / 4;
    const cx = width / 2;
    const cy = cx;
    let accRatio = 0;
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <g fill="transparent" stroke-width="${r}">
          ${data
            .map((value, i) => {
              const { item, ratio } = value;
              accRatio += ratio;
              setTimeout(() => {
                const $circle = document.getElementById(`circle-${i}`);
                $circle.style['stroke-dashoffset'] = 0;
              }, PIE_CHART_TRANSITION_WAIT);
              return `
              <circle
                class="circle-part"
                id="circle-${i}"
                r="${r}"
                cx="${cx}"
                cy="${cy}"
                stroke="${colorTable[item]}"
                stroke-dashoffset="calc(2 * 3.14 * ${r})"
                stroke-dasharray="calc(${accRatio} * calc(2 * 3.14 * ${r})) calc(2 * 3.14 * ${r} * 2)"
                >
              </circle>
            `;
            })
            .reverse()
            .join('')}
        </g>
      </svg>
    `;
  }
}
export default PieChart;
