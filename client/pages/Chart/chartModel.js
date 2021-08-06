import { API_END_POINT } from '@/config';
import api from '@/lib/api';

const processData = (data) => {
  const monthTotalList = [];
  const monthList = [];

  data.forEach((value) => {
    const { total, month } = value;
    monthTotalList.push(total);
    monthList.push(month);
  });
  return { monthTotalList, monthList };
};

const checkExist = (data, month) => {
  let exist = false;
  data.forEach((value) => {
    if (value.month === month) {
      exist = true;
    }
  });
  return exist;
};

const fillEmptyMonthData = (data, month, categoryId) => {
  let start = 0;

  const period = 6;
  const dec = 12;
  if (month - period + 1 <= 0) {
    start = dec - (month - period + 1);
  } else {
    start = month - period + 1;
  }
  for (let i = 0; i < period; i += 1) {
    const currMonth = (start + i) % dec;
    if (!checkExist(data, currMonth)) {
      data.push({
        month: currMonth,
        total: '0',
        CategoryId: categoryId,
      });
    }
  }
  data.sort((a, b) => a.month - b.month);
};

const model = {
  getLineChartData: async ({ year, month, categoryId }) => {
    const userId = localStorage.getItem('userId');
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await api.requestJSON(
      `${API_END_POINT}/history/graph/${categoryId}?year=${year}&month=${month}&userId=${userId}`,
      options
    );
    fillEmptyMonthData(res.result, month, categoryId);
    console.log(res.result);
    // { monthTotalList: [], monthList: [] }
    if (res.ok) {
      const e = {
        state: processData(res.result),
        key: 'lineChartData',
      };
      return e;
    }
  },
};
export default model;
