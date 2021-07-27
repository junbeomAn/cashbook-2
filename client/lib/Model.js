function deepCopy(obj) {
  const clone = {};
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      clone[key] = deepCopy(obj[key]);
    } else {
      clone[key] = obj[key];
    }
  }

  return clone;
}

export default class Model {
  constructor() {
    this._data = {
      key: {},
    };
    this.eventList = {
      key: new CustomEvent('key', { detail: null }),
    };
  }

  get modelState() {
    return deepCopy(this._data);
  }

  set modelState(newState) {
    this._data = { ...this._data, ...newState };
    // 다른 부분을 찾아서 그것에 해당하는 key에 대해서만 dispatchEvent
    this.modelState.History.dispatchEvent(this.eventList.History);

    // 변경이 일어난 객체들의 이벤트를 발동시킴.
    /*
    newState.keys().forEach((changedKey) => {
      this.modelState[changedKey].dispatchEvent(this.eventList[changedKey]);
    }); */

    // 아래는 이해를 돕기 위해서 위의 함수가 어떤 느낌으로 동작하는지 작성한 코드.
    // 일어난 Controller Event가 여러곳에 영향을 끼치는 경우 ( 다양한 Page / Component에 영향을 끼치는 경우 )
    // affect to login page
    this.modelState.LoginPage.dispatchEvent(this.eventList.LoginPage);

    // affect to fab button color
    this.modelState.FabButton.dispatchEvent(this.eventList.FabButton);

    // even affect to router
    this.modelState.Router.dispatchEvent(this.eventList.Router);
  }

  initData(key, state) {
    // 초기 State 등록하는 함수.
    // key : [String] 각 페이지를 구분하는 값.
    this._data[key] = { ...state, ...this._data[key] }; // 원래 등록되어 있는 state를 우선으로 저장해야함
    this.addEventList(key); // 이미 있는지 확인하고 EventList에 추가해야함.
  }

  addEventList(key) {
    // 이렇게 하면 어떤 State가 변화했을 때, 해당 State에서 event를 발생시켜 줄 수 있다.
    this.eventList[key] = new CustomEvent(key, { target: this });
  }
}
