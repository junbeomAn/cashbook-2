const getLastDayOfMonth = (month) => {
  const numberMonth = Number(month);

  if ([1, 3, 5, 7, 8, 10, 12].includes(numberMonth)) {
    return 31;
  } else if (numberMonth === 2) {
    return 28;
  } else {
    return 30;
  }
};

/**
 *
 * @param {*} histories
 * @returns result
 * [
 *  {
 *    date: 날짜,
 *    history: [{ ...내역 }, {...내역 }, { ...내역 }],
 *    income: 00000,
 *    expenditure: -00000
 *  }
 *  {
 *    date: 날짜,
 *    history: [{ ...내역 }, {...내역 }, { ...내역 }],
 *    income: 00000,
 *    expenditure: -00000
 *  }
 * ]
 */

const injectDayTotal = (historyByDate) => {
  return historyByDate.map((historyObj) => {
    let income = 0;
    let expenditure = 0;

    historyObj.history.forEach(({ amount }) => {
      if (amount >= 0) income += amount;
      else expenditure += amount;
    });
    return { ...historyObj, income, expenditure };
  });
};

const arrangeByDate = (histories) => {
  const result = [];
  let record = {};
  if (histories.length === 0) return result;

  histories.forEach((history) => {
    const dateObj = new Date(history.date);
    const yyyymmddDate = `${dateObj.getFullYear()}-${
      dateObj.getMonth() + 1
    }-${dateObj.getDate()}`;

    if (record.date === yyyymmddDate) {
      record.history.push(history);
    } else {
      result.push(record);
      record = {};
      record.date = yyyymmddDate;
      record.history = [history];
    }
  });
  result.shift();
  result.push(record);
  return injectDayTotal(result);
};

const padZero = (month) => `${month}`.padStart(2, '0');

const toMySqlDateFormat = (dateString) => {
  return dateString.toISOString().slice(0, 19).replace('T', ' ');
};
const getDateRange = (currentYear, currentMonth, range) => {
  let startDate = '';
  let endDate = '';
  const lastMonth = 12;
  let startMonth = 0;
  const endMonth = currentMonth;
  let startYear = currentYear;
  const endYear = currentYear;

  if (currentMonth - range < 0) {
    startMonth = lastMonth - (range - currentMonth) + 1;
    startYear -= 1;
  } else {
    startMonth = Math.floor(currentMonth - range) + 1;
  }

  startDate = new Date(`${startYear}-${padZero(startMonth)}-01`);
  endDate = new Date(
    `${endYear}-${padZero(endMonth)}-${getLastDayOfMonth(endMonth)}`
  );
  return [toMySqlDateFormat(startDate), toMySqlDateFormat(endDate)];
};

const formatDate = (date) => {
  return date.split('').reduce((acc, c, i) => {
    acc += c;
    if (i === 3 || i === 5) {
      acc += '-';
    }
    return acc;
  }, '');
};

const encodeHTML = (s) => {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
};

const getAccessToken = (response) => response.split('&')[0].split('=')[1];

module.exports = {
  arrangeByDate,
  getDateRange,
  formatDate,
  encodeHTML,
  getAccessToken,
};
