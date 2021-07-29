const getLastDayOfMonth = (month) => {
  month = Number(month);

  if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
    return 31;
  }
  else if (month === 2) {
    return 28;
  } else {
    return 30;
  }
}

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

const arrangeByDate = (histories) => {
  const result = [];
  let record = {};

  histories.forEach(history => {
    const dateObj = new Date(history.date);
    const YYYYMMDD_date = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`;

    if (record.date === YYYYMMDD_date) {
      record.history.push(history);
    } else {
      result.push(record);
      record = {};
      record.date = YYYYMMDD_date;
      record.history = [history];
    }
    
  })

  return injectDayTotal(result);
}

const injectDayTotal = (historyByDate) => {
  return historyByDate.map(historyObj => {
    let income = 0;
    let expenditure = 0;

    historyObj.history.forEach(({ amount }) => {
      if (amount >= 0) income += amount;
      else expenditure += amount;
    })
    return { ...historyObj, income, expenditure };
  })
}

const getDateRange = (currentYear, currentMonth, range) => {
  let startDate, endDate;
  const lastMonth = 12;
  let startMonth = 0;
  let endMonth = currentMonth;
  let startYear = currentYear;
  let endYear = currentYear;

  if (currentMonth - range < 0) {
    startMonth = lastMonth - (range - currentMonth) + 1; 
    startYear -= 1;
  } else {
    startMonth = Math.floor(currentMonth - range) + 1;
  }
  startDate = new Date(`${startYear}-${startMonth}-1`);
  endDate = new Date(`${endYear}-${endMonth}-${getLastDayOfMonth(endMonth)}`);
  return [startDate, endDate];
}

const formatDate = (date) => {
  
  return date.split('').reduce((acc, c, i) => {
    acc += c;;
    if (i === 3 || i === 5) {
      acc += '-'
    }
    return acc;
  }, '');
}

function encodeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

module.exports = {
  arrangeByDate,
  getDateRange,
  formatDate,
  encodeHTML
}