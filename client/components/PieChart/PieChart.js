import { COLOR_CONSTANT } from '@/util/constant';

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

function genSvgTagByName({ tag, ...otherOptions }) {
  const $el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(otherOptions).forEach(([prop, value]) => {
    $el.setAttribute(prop, value);
  });
  return $el;
}

let accRatio = 0;
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

function initPieChart(data, width, height) {
  const r = String(Number(width) / 4);
  const cx = String(Number(width) / 2);
  const cy = cx;

  const $svg = genSvgTagByName({
    tag: 'svg',
    width,
    height,
    viewBox: `0 0 ${width} ${height}`,
  });
  const $g = genSvgTagByName({
    tag: 'g',
    fill: 'transparent',
    'stroke-width': r,
  });

  const circles = [];

  data.forEach(({ item, ratio }) => {
    accRatio += ratio;
    const $circle = genSvgTagByName({
      tag: 'circle',
      r,
      cx,
      cy,
      stroke: colorTable[item],
      'stroke-dasharray': `calc(${accRatio} * calc(2 * 3.14 * ${r})) calc(2 * 3.14 * ${r} * 2)`,
      'stroke-dashoffset': `calc(2 * 3.14 * ${r})`,
    });
    $circle.style.transition = 'stroke-dashoffset 2000ms';
    setTimeout(() => {
      $circle.style['stroke-dashoffset'] = 0;
    }, 300);
    circles.unshift($circle);
  });

  $g.append(...circles);
  $svg.append($g);

  return $svg;
}

export default initPieChart;
