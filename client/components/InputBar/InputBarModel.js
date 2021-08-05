import { API_END_POINT } from '@/config';
import api from '@/lib/api';

const dayString = ['일', '월', '화', '수', '목', '금', '토'];

function appendDataToDailyHistoryData(dailyHistoryData, appendData) {
  const keys = Object.keys(dailyHistoryData.history);
  dailyHistoryData.history[keys.length] = {
    category: appendData.category,
    categoryColor: appendData.categoryColor,
    contents: appendData.contents,
    payment: appendData.payment,
    amount: appendData.amount,
  };
  if (appendData.amount > 0) dailyHistoryData.income += appendData.amount;
  else dailyHistoryData.expenditure += appendData.amount;
  return dailyHistoryData;
}

function appendDataToMonthHistory(monthlyData, appendData) {
  const { date } = appendData;
  const year = Number(appendData.date.substring(0, 4));
  const month = Number(appendData.date.substring(4, 6));
  const day = Number(appendData.date.substring(6, 8));
  let dow = new Date(
    `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`
  ).getDay();
  dow = dayString[dow];
  const { historyData } = monthlyData;
  const result = {
    ...monthlyData,
  };
  const temp = [];
  const newDailyData = {
    date: {
      year,
      month,
      day,
      dow,
    },
    history: [],
    income: 0,
    expenditure: 0,
  };

  if (Object.keys(historyData).length === 0) {
    temp.push(appendDataToDailyHistoryData(newDailyData, appendData));
  } else {
    for (const key in historyData) {
      const dailyHistoryData = historyData[key];
      const cDay = dailyHistoryData.date.day;
      if (day > cDay) {
        temp.push(appendDataToDailyHistoryData(newDailyData, appendData));
        temp.push(dailyHistoryData);
      } else if (day === cDay) {
        temp.push(appendDataToDailyHistoryData(dailyHistoryData, appendData));
      } else {
        temp.push(dailyHistoryData);
      }
    }
  }
  result.historyData = temp;
  return result;
}

function appendDataToHistory(historyData, appendData) {
  const year = Number(appendData.date.substring(0, 4));
  const month = Number(appendData.date.substring(4, 6));
  const result = [];
  const newMonthlyData = {
    currentMonth: month,
    currentYear: year,
    historyData: [],
  };

  if (Object.keys(historyData).length === 0) {
    result.push(appendDataToMonthHistory(newMonthlyData, appendData));
  } else {
    for (const key in historyData) {
      const monthlyData = historyData[key];
      if (monthlyData.currentMonth > month && monthlyData.currentYear >= year) {
        result.push(appendDataToMonthHistory(newMonthlyData, appendData));
        result.push(monthlyData);
      } else if (
        monthlyData.currentMonth === month &&
        monthlyData.currentYear === year
      ) {
        result.push(appendDataToMonthHistory(monthlyData, appendData));
      } else {
        result.push(monthlyData);
      }
    }
  }
  return result;
}

const model = {
  handleAddPayment: async ({ source, add }) => {
    const paymentData = [];
    Object.keys(source).forEach((key) => {
      paymentData.push(source[key]);
    });
    paymentData.push(add);
    console.group('ADD_PAYMENT');
    console.log(source, add);
    console.log(paymentData);
    console.groupEnd();

    const body = {
      method: add.kind,
      color: add.paymentColor,
      userId: localStorage.getItem('userId'),
    };
    const { apiResult } = await api.requestJSON(`${API_END_POINT}/payment`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(apiResult);

    const e = {
      state: { data: paymentData },
      key: 'payment',
    };

    return e;
  },
  handleDelPayment: async ({ source, deleteKey }) => {
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
    const { apiResult } = await api.requestJSON(`${API_END_POINT}/payment`, {
      method: 'DELETE',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(apiResult);

    const e = {
      state: { data: paymentData },
      key: 'payment',
    };

    return e;
  },
  handleDataPost: async ({ source, add }) => {
    const historyData = source;
    const data = add;
    const { date, categoryColor, cotnents, payment, amount } = data;
    const categoryId = categoryColor[categoryColor.legnth - 1];

    const result = appendDataToHistory(historyData, data);

    const e = {
      state: { data: result },
      key: 'historyData',
    };

    const body = {
      date,
      categoryId,
      cotnents,
      payment,
      amount,
      userId: localStorage.getItem('userId'),
    };
    const { apiResult } = await api.requestJSON(`${API_END_POINT}/history`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(apiResult);

    // TODO : ERROR 처리
    if (!apiResult) console.log(apiResult);
    return e;
  },
};
export default model;
