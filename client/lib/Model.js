import { deepCopy } from '@/util/util';

export default class Model {
  constructor() {
    this._data = {};
  }

  get modelState() {
    return deepCopy(this._data);
  }

  setModelState(key, newState) {
    this._data[key] = { ...this._data[key], ...newState };
    document.dispatchEvent(
      new CustomEvent(key, { detail: this.modelState[key] })
    );
  }

  initData(key, state) {
    // 초기 State 등록하는 함수.
    // key : [String] 각 페이지를 구분하는 값.
    this._data[key] = { ...state, ...this._data[key] };
  }
}
