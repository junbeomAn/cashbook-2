import { deepCopy, deepCompare } from '@/util/util';

export default class Model {
  constructor() {
    this._data = {};
  }

  get modelState() {
    return deepCopy(this._data);
  }

  setModelState(key, newState) {
    const prevState = this._data[key];
    this._data[key] = { ...this._data[key], ...newState };
    const nowState = this._data[key];
    if (!deepCompare(prevState, nowState)) {
      console.group('[MODEL] Set Model State is running');
      console.log('PREV', prevState);
      console.log('NEXT', nowState);
      console.groupEnd();
      document.dispatchEvent(
        new CustomEvent(key, { detail: this.modelState[key] })
      );
    }
  }

  initData(key, state) {
    // 초기 State 등록하는 함수.
    // key : [String] 각 페이지를 구분하는 값.
    console.group('[MODEL] State Init');
    if (!this._data[key]) {
      console.debug('State init :', key, state);
      this._data[key] = { ...state, ...this._data[key] };
    } else {
      console.debug('State not init cause source is not empty', key, state);
    }
    console.groupEnd();
  }
}
