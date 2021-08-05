const api = {
  requestJSON: async (url, options) => {
    const result = await fetch(url, options);
    return result.json();
  },
};

export default api;
