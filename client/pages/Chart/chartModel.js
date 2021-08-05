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
