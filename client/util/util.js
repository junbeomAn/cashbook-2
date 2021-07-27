function deepCopy(obj) {
  const clone = {};
  obj.keys().forEach((key) => {
    if (typeof obj[key] === 'object') {
      clone[key] = deepCopy(obj[key]);
    } else {
      clone[key] = obj[key];
    }
  });
  return clone;
}

const $ = {
  qs: (query) => document.querySelector(query),
  qsa: (query) => document.querySelectorAll(query),
  create: (element) => document.createElement(element),
};

export { deepCopy, $ };
