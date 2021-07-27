export default class Component extends HTMLElement {
  constructor(props) {
    super(props);
    this.parent = props.parent;
  }

  connectedCallback() {
    // DOM에 Component 추가, 기본 제공 함수
    console.log('Attached!', this);
  }

  disconnectedCallback() {
    // DOM에서 Component 제거, 기본 제공 함수
    console.log('Detached!', this);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    // Component의 속성이 변경, 기본 제공 함수
    console.log('Changed!', this, attrName, oldVal, newVal);
  }

  setComponentState() {}

  addEvent() {}

  generateTemplate() {} // 상속받은곳에서 직접 구현해야 하는 Template을 return 하는 함수.

  getTemplate() {} // 언젠가 어디선가 쓸 수도 있는 함수

  render() {} // 부모에 붙여주게 되는 로직?

  update() {
    if (this.shouldComponentUpdate()) {
      this.render();
      this.componentDidUpdate();
    }
  }

  componentDidUpdate() {}

  componentDidMount() {}

  shouldComponentUpdate() {}
}

// 위의 Component를 상속받은 Class를 사용하려면 다음의 등록과정이 반드시 필요합니다.
// customElements.define('component-com', Component); // "-" 가 반드시 포함된 이름이어야 합니다.
// 그러나 2번 실행하면 오류가 생기므로, 반드시 모든 파일에서 1회만 수행되어야 합니다.
