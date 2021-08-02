const RANDOM_ID_NUMBER_COUNT = 8;

function deepCopy(obj) {
  const clone = {};

  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object') {
      clone[key] = deepCopy(obj[key]);
    } else {
      clone[key] = obj[key];
    }
  });
  return clone;
}

function deepCompare(prev, next) {
  if (typeof prev === 'object' && typeof next === 'object') {
    for (const key in prev) {
      if (next[prev]) {
        if (!deepCompare(prev[key], next[key])) {
          return false;
        }
      } else {
        return false;
      }
    }
    return true;
  }
  return false;
}

function moneyFormat(num) {
  return Number(num.toFixed(1)).toLocaleString();
}

function getUniqueId(componentName) {
  return `${componentName}-id${Math.floor(
    Math.random() * 10 ** RANDOM_ID_NUMBER_COUNT
  )}`;
}

const $ = {
  qs: (query) => document.querySelector(query),
  qsa: (query) => document.querySelectorAll(query),
  create: (element) => document.createElement(element),
};

const getAmountWithComma = (amount) => Number(amount).toLocaleString();

function getToday() {
  const nowDate = new Date();
  return `
    ${nowDate.getFullYear()}${`${nowDate.getMonth() + 1}`.padStart(2, '0')}
  `;
}

export {
  deepCopy,
  deepCompare,
  moneyFormat,
  getAmountWithComma,
  $,
  getUniqueId,
  getToday,
};
