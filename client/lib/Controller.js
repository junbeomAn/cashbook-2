export default class Controller {
  constructor(props) {
    this.model = props.model;
    this.eventList = {
      key: {
        callback: () => {},
      },
    };
  }

  use(eventType, callback) {
    // Callback 은 this.model을 사용해서 state에 자유롭게 접근 할 수 있다.
    // 그러나 오직 setModelState를 통해서만 Model의 값을 수정 할 수 있습니다.
    // Callback의 인자는 변경될 정보와 변경이 일어난 객체 등을 가진 e ( custom event ) 객체입니다.
    this.eventList[eventType] = { callback };
  }

  emitEvent(e) {
    /**
      e.data = [Object] 변경될 정보, 이 정보가 State와 동일한 key를 가지지 않음에 유의.
      e.type = [String] 변경이 일어난 event type.
    */
    this.eventList[e.type].callback(e);
  }
}
