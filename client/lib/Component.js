import { deepCopy, getUniqueId, $ } from '../util/util';

export default class Component {
  constructor(params) {
    const { parent, $target, componentName } = params;
    this.componentName = componentName; // Unique ID를 만들기 위한 용도

    this.parent = parent;
    if (parent instanceof Component) {
      this.parent.childs.push(this);
    }
    if ($target && !($target instanceof HTMLElement)) {
      throw new Error(
        'Component : $target은 반드시 HTMLelement거나 null 혹은 undefined 이어야합니다.'
      );
    }
    this.$target = $target; // HTMLElements

    // Component 외부 요소 정의
    this.controller = params.controller;

    // Component 내부 상태 정의
    this.id = getUniqueId(this.componentName);
    this._componentState = params.componentState;
    this.eventList = [];
    this.childs = [];
    this.innerNode = {};
    this.innerHTML = null;
    this.render();
  }

  initState(componentState = {}, modelState = {}) {
    this._componentState = componentState;
    this._modelState = modelState;
  }

  get componentState() {
    return deepCopy(this._componentState);
  }

  set componentState(changedState) {
    const prevState = this.componentState;
    this._componentState = { ...this._componentState, ...changedState };
    const newState = this.componentState;
    this.update(prevState, newState);
  }

  update(prevState, newState) {
    if (this.shouldComponentUpdate(prevState, newState)) {
      let $this = null;
      if (this.innerNode.parentNode) {
        $this = this.innerNode;
      } else {
        $this = document.querySelector(`#${this.id}`);
        this.$target = $this.parentNode;
      }

      this.preTemplate();
      const $container = $.create('div');
      this.innerHTML = this.defineTemplate();
      $container.innerHTML = this.innerHTML;
      $container.id = this.id;
      this.innerNode = $container;

      if (this.$target) {
        this.$target.replaceChild(this.innerNode, $this);
      }

      // Event 재등록
      this.setEvent(this.innerNode);
    }
  }

  addEvent(target, type, callback) {
    /**
     *  target: [String][HTMLElement] 이벤트가 붙을 대상.
     *  type: [String] Event String ex ) click.
     *  callback: [Function] 이벤트 발생시 실행할 함수.
     * */
    let i = 0;
    for (i = 0; i < this.eventList.length; i += 1) {
      // 이벤트 리스트에 있다면 갱신.
      if (
        this.eventList[i].target === target &&
        this.eventList[i].type === type
      ) {
        this.eventList[i].callback = callback;
      }
    }
    if (i === this.eventList.length) {
      // 만약 eventList에 없으면 등록.
      this.eventList.push({ target, type, callback });
    }
  }

  setEvent($eventDest) {
    // 이벤트 등록은 반드시 render이후에 실행되어야 한다.
    // 자신의 내부에 있는 객체에만 등록한다.
    this.childs.forEach((child) => {
      child.setEvent($eventDest);
    });

    const $this = $eventDest;

    for (let j = 0; j < this.eventList.length; j += 1) {
      const { target, type, callback } = this.eventList[j];
      if (target instanceof HTMLElement) {
        // 만약 등록된 목표 객체가 HTMLElement 라면 바로 등록
        target.addEventListener(type, callback);
      } else if (typeof target === 'string') {
        // 만약 등록된 목표 객체가 문자열이면 Query 문으로 "모두" 찾아서 등록
        const $eventTarget = $this.querySelectorAll(`#${this.id} ${target}`); // 자신의 자손중 목표 선택자를 찾아냄.
        for (let i = 0; i < $eventTarget.length; i += 1) {
          $eventTarget[i].addEventListener(type, callback);
        }
      }
    }
  }

  preTemplate() {}

  resolveChild(index) {
    return this.childs[index];
  }

  defineTemplate() {
    // 상속받은곳에서 직접 구현해야 하는 Template을 return 하는 함수.
    // useEvent도 여기서 사용해서 event 를 정의해줘야한다.
    throw new Error(
      '[Component] : Component를 사용하기 위해서는 Template을 반환하는 함수를 구현해야합니다.'
    );
  }

  getTemplate() {
    return `<div id=${this.id}> ${this.innerHTML} </div>`;
  }

  render() {
    // Caution! 이 함수는 변경사항이 없더라도 Template을 재생성합니다!
    this.preTemplate();
    const $container = $.create('div');
    this.innerHTML = this.defineTemplate();
    $container.innerHTML = this.innerHTML;
    $container.id = this.id;
    this.innerNode = $container;

    // Event 재등록
    this.setEvent(this.innerNode);
    if (this.$target) {
      this.$target.appendChild(this.innerNode);
    }
  }

  registerPage() {
    // Component가 직접 어딘가 붙어야 할 때 사용하는 함수.
    // $target : HTMLElement, PageElement의 경우 반드시 Root를 지정해서 붙여주어야 합니다.
    if (this.$target) {
      this.$target.appendChild(this.innerNode);
    } else if (this.parent) {
      this.parent.appendChild(this.innerNode);
    } else {
      throw new Error(
        'Component : Component에 등록된 register 대상이 없습니다.'
      );
    }
  }

  componentDidUpdate() {}

  componentDidMount() {}

  shouldComponentUpdate(prevState, newState) {
    // 더 자세한 비교 방법은 재정의하여 정의한다.

    for (const key in prevState) {
      if (newState[key] !== prevState[key]) {
        return true;
      }
    }
    return false;
  }
}
