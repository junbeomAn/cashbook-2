import { deepCopy, getUniqueId } from '../util/util';

export default class Component extends HTMLElement {
  constructor(params) {
    super();
    if (!params) {
      // innerHTML에 <test-component> 같이 추가하게 되면 현재 Constructor를 호출한다 ( params는 null로.. )
      // 따라서 innerHTML에서 Parsing하는 동작은 무시해주기 위해서 이렇게 사용한다.
      return this;
    }

    const { parent, $target, componentName } = params;
    this.componentName = componentName;
    try {
      customElements.define(componentName, this);
    } catch (error) {
      /* 2번 정의시 아무것도 하지 않음 */
    }

    this.parent = parent;
    if (parent instanceof Component) {
      this.parent.childs.push(this);
    }

    this.controller = params.controller;
    this.$target = $target;
    this.id = getUniqueId(this.componentName);
    this._componentState = params.componentState;
    this.eventList = [];
    this.childs = [];
    this.render();
  }

  initState(componentState = {}, modelState = {}) {
    console.log(componentState, modelState);
    this._componentState = componentState;
    this._modelState = modelState;
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
      $documentDest.textContent = this.innerHTML;
      this.setEvent();
    }
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
        const $eventTarget = this.querySelectorAll(target);
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

  render() {
    // Caution! 이 함수는 변경사항이 없더라도 Template을 재생성합니다!
    this.innerHTML = this.defineTemplate();
    this.setEvent();
  }

  registerPage() {
    // Component가 직접 어딘가 붙어야 할 때 사용하는 함수.
    // $target : HTMLElement, PageElement의 경우 반드시 Root를 지정해서 붙여주어야 합니다.
    if (this.$target) {
      this.$target.appendChild(this);
    } else if (this.parent) {
      this.parent.appendChild(this);
    } else {
      throw new Error(
        'Component : Component에 등록된 register 대상이 없습니다.'
      );
    }
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
