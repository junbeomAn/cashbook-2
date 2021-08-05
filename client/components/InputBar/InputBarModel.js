// import { API_END_POINT } from '@/config';
// import api from '@/lib/api';

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
  handleDataPost: async ({ source, add }) => {
    // const { date, categoryColor, cotnents, payment, amount } = data;
    // const categoryId = categoryColor[categoryColor.legnth - 1];
    const historyData = source;
    const data = add;

    const result = appendDataToHistory(historyData, data);

    const e = {
      state: { data: result },
      key: 'historyData',
    };
    return e;

    /*
    const body = {
      date,
      categoryId,
      cotnents,
      payment,
      amount,
    };
    const { result } = await api.requestJSON(`${API_END_POINT}/history`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // TODO : ERROR 처리
    if (!result) console.log(result);
  */
  },
};
export default model;
