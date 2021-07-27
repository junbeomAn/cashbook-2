export default class Component extends HTMLElement {
  constructor() {}

  render() {} // 부모에 붙여주게 되는 로직?

  update() {
    if (this.shouldComponentUpdate()) {
      this.render();
      this.componentDidUpdate();
    }
  }

  setComponentState() {}

  addEvent() {}

  generateTemplate() {} // 상속받은곳에서 직접 구현해야 하는 Template을 return 하는 함수.

  getTemplate() {} // 언젠가 어디선가 쓸 수도 있는 함수

  componentDidUpdate() {}

  componentDidMount() {}

  shouldComponentUpdate() {}
}
