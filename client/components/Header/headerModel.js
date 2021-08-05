import { API_END_POINT } from '@/config';
import api from '@/lib/api';

const createNewHistory = (history) => {
  const categories = [
    '의료/건강',
    '쇼핑/뷰티',
    '교통',
    '식비',
    '문화/여가',
    '미분류',
    '생활',
    '월급',
    '용돈',
    '기타 수입',
  ];
  return history.map((item) => {
    const category = categories[item.CategoryId - 1];
    const categoryColor = `category-${item.CategoryId}`;
    return {
      ...item,
      category,
      categoryColor,
    };
  });
};

const processData = ({ year, month, data }) => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];

  const result = {
    currentMonth: month,
    currentYear: year,
  };
  const historyData = data.map((item) => {
    const [y, m, d] = item.date.split('-');
    const nowTime = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    const dayIdx = new Date(nowTime).getDay();

    return {
      ...item,
      date: { year: y, month: m, day: d, dow: days[dayIdx] },
      history: createNewHistory(item.history),
    };
  });
  result.historyData = historyData;
  return [result];
};

const model = {
  getHistories: async ({ year, month }) => {
    const userId = localStorage.getItem('userId');
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await api.requestJSON(
      `${API_END_POINT}/history?year=${year}&month=${month}&userId=${userId}`,
      options
    );
    if (res.ok) {
      const state = {
        data: processData({ data: res.result, year, month }),
      };
      const e = {
        state,
        key: 'historyData',
      };
      return e;
    } else {
      return false;
    }
  },
};
export default model;
