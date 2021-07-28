import { deepCopy, $, getUniqueId } from '../util/util';

export default class Component extends HTMLElement {
  constructor(params) {
    super();
    const { parent, controller, $target } = params;
    this._componentState = {};
    this.componentName = 'default-component';
    this.eventList = [];
    this.childs = [];
    console.log(parent);

    if (parent instanceof Component) {
      this.parent = parent;
      this.parent.childs.push(this);
    }

    this.controller = controller;
    this.$target = $target;
    this.id = getUniqueId(this.componentName);
    console.log(this);
    this.generateTemplate();
  }

  get componentState() {
    return deepCopy(this._componentState);
  }

  set componentState(changedState) {
    const prevState = this.getComponentState();
    this._componentState = { ...this._componentState, ...changedState };
    const newState = this.getComponentState();
    this.update(prevState, newState);
  }

  update(prevState, newState) {
    if (this.shouldComponentUpdate(prevState, newState)) {
      this.generateTemplate();
      const $parent = this.parentElement;

      // Component 내의 객체들은 literal 로 추가되기 때문에 id로 찾아주어야 한다.
      const $documentDest = $parent.querySelector(this.id);
      $documentDest.innerHTML = this.innerHTML;
      this.setEvent();
    }
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

  addEvent(target, type, callback) {
    /**
     *  target: [String][HTMLElement] 이벤트가 붙을 대상.
     *  type: [String] Event String ex ) click.
     *  callback: [Function] 이벤트 발생시 실행할 함수.
     * */
    this.eventList.push({ target, type, callback });
  }

  setEvent() {
    this.childs.forEach((child) => child.setEvent());

    for (let j = 0; j < this.eventList.length; j += 1) {
      const { target, type, callback } = this.eventList[j];
      if (target instanceof HTMLElement) {
        // 만약 등록된 목표 객체가 HTMLElement 라면 바로 등록
        target.addEventListener(type, callback);
      } else if (typeof target === 'string') {
        // 만약 등록된 목표 객체가 문자열이면 Query 문으로 "모두" 찾아서 등록
        const $eventTarget = $.qsa(target);
        for (let i = 0; i < $eventTarget.length; i += 1) {
          $eventTarget[i].addEventListener(type, callback);
        }
      }
    }
  }

  defineTemplate() {
    // 상속받은곳에서 직접 구현해야 하는 Template을 return 하는 함수.
    // useEvent도 여기서 사용해서 event 를 정의해줘야한다.
    throw new Error(
      '[Component] : Component를 사용하기 위해서는 Template을 반환하는 함수를 구현해야합니다.'
    );
  }

  getTemplate() {
    return this.outerHTML;
  }

  generateTemplate() {
    const $template = $.create(this.componentName);
    $template.innerHTML = this.defineTemplate();
    this.setEvent();
    console.log('Called1');
  }

  render() {
    // Caution! 이 함수는 변경사항이 없더라도 Template을 재생성합니다!
    this.generateTemplate();
    this.setEvent();
  }

  register() {
    // $target : HTMLElement, PageElement의 경우 반드시 Root를 지정해서 붙여주어야 합니다.
    const $thisComponent = this.generateTemplate();
    this.$target.appendChild($thisComponent);
  }

  componentDidUpdate() {}

  componentDidMount() {}

  static shouldComponentUpdate(prevState, newState) {
    // 더 자세한 비교 방법은 재정의하여 정의한다.
    if (prevState !== newState) {
      return true;
    }
    return false;
  }
}
