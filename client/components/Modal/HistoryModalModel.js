import { API_END_POINT } from '@/config';
import categoryInfo from '@/util/category';
import api from '@/lib/api';

function getCategoryId(catData) {
  for (let i = 0; i < categoryInfo.length; i += 1) {
    if (categoryInfo[i].name === catData) return categoryInfo[i].number;
  }
  return 1;
}

const model = {
  handleModifyEvent: async (modifyData) => {
    const { date, category, contents, payment, amount, id } = modifyData;
    // date : 20210805
    const dateParse = date.split('T')[0];
    const splitDate = dateParse.split('-');
    const formatDate = `${splitDate[0]}${splitDate[1]}${splitDate[2]}`;
    const body = {
      date: formatDate,
      categoryId: getCategoryId(category),
      contents,
      payment,
      amount,
      userId: localStorage.getItem('userId'),
    };

    await api.requestJSON(`${API_END_POINT}/history/?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const e = {
      state: { data: [] },
      key: 'historyData',
    };

    return e;
  },
  handleDeleteEvent: async ({ source, deleteKey }) => {
    const paymentData = source;
    const delObj = {};
    for (const key in paymentData) {
      if (paymentData[key].kind === deleteKey) {
        delObj.method = paymentData[key].kind;
        delObj.color = paymentData[key].componentColor;
        delete paymentData[key];
        break;
      }
    }
    const body = {
      method: delObj.method,
      color: delObj.color,
      userId: localStorage.getItem('userId'),
    };
    await api.requestJSON(`${API_END_POINT}/payment`, {
      method: 'DELETE',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const e = {
      state: { data: paymentData },
      key: 'payment',
    };

    return e;
  },
};
export default model;
