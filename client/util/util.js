import categoryInfo from './category';

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
  // return true if same.
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
    ${nowDate.getFullYear()}${`${nowDate.getMonth() + 1}`.padStart(
    2,
    '0'
  )}${`${nowDate.getDate()}`.padStart(2, '0')}
  `;
}

function objectToList(obj) {
  const returnList = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      returnList.push(obj[key]);
    }
  }
  return returnList;
}

function getCategoryColor(name) {
  for (let i = 0; i < categoryInfo.length; i += 1) {
    if (categoryInfo[i].name === name) {
      return categoryInfo[i].color;
    }
  }
  return false;
}

export {
  deepCopy,
  deepCompare,
  moneyFormat,
  getAmountWithComma,
  $,
  getUniqueId,
  getToday,
  objectToList,
  getCategoryColor,
};
