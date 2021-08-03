import Component from '@/lib/Component';
import { LINE_CHART } from '@/util/constant';
import './lineChart.scss';

export default class LineChart extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'line-chart',
      componentState: { count: 0 },
    });
  }

  preTemplate() {}

  horizonLine(sx, sy, ex, ey) {
    return `<path class="line-chart-horizon-line" d="M${sx},${sy}L${ex},${ey}" stroke="#333" stroke-width="0.5" stroke-linejoin="round"/>
    `;
  }

  vertiCalLine(sx, sy, ex, ey) {
    return `<path class="line-chart-vertical-line" d="M${sx},${sy}L${ex},${ey}" stroke="#333" stroke-width="0.5" stroke-linejoin="round"/>
    `;
  }

  coordLen(coord, i) {
    return Math.sqrt(
      (coord[i + 1].x - coord[i].x) ** 2 + (coord[i + 1].y - coord[i].y) ** 2
    );
  }

  makePath(coordList, height) {
    const coordData = [{ x: 0, y: height }, ...coordList];
    let result = '<path class="graph-line" d="';
    result += `M 0, ${height} `;
    for (let i = 0; i < coordData.length - 1; i += 1) {
      const interval = Math.min(
        this.coordLen(coordData, i) * LINE_CHART.CURVE_RATIO,
        LINE_CHART.MIN_CURVE_VALUE
      );

      result += `C ${coordData[i].x + 1 + interval} ${coordData[i].y + 1}, ${
        coordData[i + 1].x + 1 - interval
      } ${coordData[i + 1].y + 1}, ${coordData[i + 1].x + 1} ${
        coordData[i + 1].y + 1
      }`;
    }

    result += '" stroke="#2AC1BC" stroke-width="2" stroke-linejoin="round"/>';

    setTimeout(() => {
      const MAX_COUNT = coordData.length;
      const $chartLine = this.querySelector('.graph-line');
      let lineCount = 0;
      const drawLine = setInterval(() => {
        const totalLength = $chartLine.getTotalLength();
        $chartLine.style['stroke-dasharray'] = `${
          (totalLength * lineCount) / MAX_COUNT
        }px ${totalLength - (totalLength * lineCount) / MAX_COUNT}px`;
        lineCount += 1;
        if (lineCount === MAX_COUNT + 1) {
          clearInterval(drawLine);
        }
      }, LINE_CHART.POINT_WAIT_INTERVAL * 1000);
    }, LINE_CHART.POINT_WAIT_TIME * 1000);

    return result;
  }

  makePoint(bottom, left, i) {
    let result = '<div class="line-chart-spend-point" ';
    result += `style="bottom:${bottom}px; left:${left}px;`;
    result += `animation-delay: ${
      LINE_CHART.POINT_WAIT_TIME + LINE_CHART.POINT_WAIT_INTERVAL * i
    }s;"`;
    result += '></div>';
    return result;
  }

  defineTemplate() {
    const monthlySpendAmount = [
      600000, 1200000, 30000, 100000, 0, 2000000, 1500000, 0, 600000, 1200000,
      30000, 100000, 0, 2000000, 1500000,
    ];
    const maxAmount = Math.max(...monthlySpendAmount);

    const width = LINE_CHART.WIDTH;
    const height = LINE_CHART.HEIGHT;
    const interval = LINE_CHART.INTERVAL;

    let result = `
    <div class="line-chart-container">
      <svg 
        class="line-chart" 
        width="${width + 2}" height="${height + 2}" 
        viewBox="-1 -1 ${width + 2} ${height + 2}" 
        fill="none" xmlns="http://www.w3.org/2000/svg">`;

    for (let i = 0; i < height / interval + 1; i += 1) {
      result += this.horizonLine(0, i * interval, width, i * interval);
    }
    for (let i = 0; i < width / interval + 1; i += 1) {
      result += this.vertiCalLine(i * interval, height, i * interval, 0);
    }

    const coordList = [];
    for (let i = 0; i < monthlySpendAmount.length; i += 1) {
      coordList.push({
        y:
          height -
          height *
            (monthlySpendAmount[i] / (maxAmount * LINE_CHART.MAX_VALUE_RATIO)),
        x: width * ((i + 1) / (monthlySpendAmount.length + 1)),
      });
    }

    result += this.makePath(coordList, height);

    result += '<div class="line-chart-dot-container">';
    for (let i = 0; i < monthlySpendAmount.length; i += 1) {
      result += this.makePoint(height - coordList[i].y, coordList[i].x, i);
    }
    result += '</div>';

    result += '</svg></div>';
    return result;
  }
}
