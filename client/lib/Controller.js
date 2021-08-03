export default class Controller {
  constructor(props) {
    this.model = props.model;
    this.eventList = {};
    this.eventRenderCallback = {};
  }

  use(eventType, callback) {
    this.eventList[eventType] = { callback };
  }

  async emitEvent(type) {
    /* e : [Object]
        - state : [Object] ModelState에 들어갈 변경된 State.
        - key : [String] ModelState에서 바뀐 state의 key.
     */
    const e = await this.eventList[type].callback();
    this.model.setModelState(e.key, e.state);
  }

  addEventCallback(key, callback) {
    // Add Event Listener를 document에서 하게 되므로,
    if (!this.eventRenderCallback[key]) {
      this.eventRenderCallback[key] = [];
      document.addEventListener(key, (e) => {
        console.group('[CONTROLLER] EVENT CALLBACK RUN!');
        this.eventRenderCallback[key].forEach((cb) => {
          cb(e);
        });

        console.groupEnd();
      });
    }
    this.eventRenderCallback[key].push(callback);
  }
}
