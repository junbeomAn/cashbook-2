import { deepCopy, getUniqueId, $ } from '../util/util';

export default class Component {
  constructor(params) {
    const { parent, $target } = params;
    let { componentName } = params;

    // Component 외부 요소 정의
    this.controller = params.controller;

    // Component 내부 상태 정의
    if (!componentName) {
      componentName = getUniqueId();
    }
    this.componentName = componentName; // Unique ID를 만들기 위한 용도
    this.id = getUniqueId(this.componentName);
    this._componentState = params.componentState;
    this.eventList = [];
    this.childs = {}; // 이벤트 등록, update시 필요한 자식들
    this.innerNode = {}; // 자신을 HTMLElement로 가지고 있음.
    this.innerHTML = null; // innerNode의 또 다른 innerHTML 표현 ( Template 표현 )
    this.containerClass = params.containerClass || 'adjustFit';
    this._props = params.props;
    this.isComponentMounted = false;

    // Parent는 Component가 붙어있을 또 다른 Component 객체입니다. 최상위 객체는 null을 가집니다.
    if (parent !== null && !(parent instanceof Component)) {
      throw new Error('Component : 옳바르지 못한 parent가 설정되었습니다.');
    }
    this.parent = parent;
    // 부모의 자식으로 자신을 설정.
    if (parent instanceof Component) {
      if (params.keyword) {
        // query keyword 설정시 해당 keyword를 key로 자신을 설정.
        this.parent.childs[params.keyword] = this;
      } else {
        // query keyword 설정하지 않을 시 자신의 ID를 key로 설정.
        this.parent.childs[this.id] = this;
      }
    }

    // target은 Component Node 객체를 붙일 HTMLelement입니다.
    if ($target && !($target instanceof HTMLElement)) {
      throw new Error(
        'Component : $target은 반드시 HTMLelement거나 null 혹은 undefined 이어야합니다.'
      );
    }
    this.$target = $target; // HTMLElements
    this.render();
  }

  initState(componentState = {}, modelState = {}) {
    this._componentState = componentState;
    this._modelState = modelState;
  }

  get props() {
    return deepCopy(this._props);
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

  adjustWithDocumentNode() {
    let $this = null;
    if (this.innerNode.parentNode) {
      $this = this.innerNode;
      this.$target = $this.parentNode;
    } else {
      $this = document.querySelector(`#${this.id}`);
      if ($this) {
        this.$target = $this.parentNode;
      }
    }
    return $this;
  }

  update(prevState, newState) {
    // 변경 사항이 있을 때에만 update.
    if (this.shouldComponentUpdate(prevState, newState)) {
      const $this = this.adjustWithDocumentNode();

      this.setTemplate();
      if (this.$target) {
        this.$target.replaceChild(this.innerNode, $this);
      }

      // Event 재등록
      this.setEvent(this.innerNode);
      Object.keys(this.childs).forEach((el) => {
        this.childs[el].componentDidUpdate();
      });
      this.componentDidUpdate();
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
        break;
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
    Object.keys(this.childs).forEach((child) => {
      this.childs[child].setEvent($eventDest);
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

  resolveChild(query, template = true) {
    // preTemplate에서 정의한 자식을 query 문자열이나 숫자로 가져오는 함수.
    const keys = Object.keys(this.childs);
    if (typeof query === 'number') {
      for (let i = 0; i < keys.length; i += 1) {
        if (i === query) {
          if (template) return this.childs[keys[i]].getTemplate();
          return this.childs[keys[i]];
        }
      }
    } else if (typeof query === 'string') {
      try {
        if (template) return this.childs[query].getTemplate();
        return this.childs[query];
      } catch (error) {
        throw new Error(
          `Component : resolveChild 에 keyword : ${query}에 해당하는 값이 없습니다.`
        );
      }
    }
    return '';
  }

  querySelector(query) {
    this.innerNode = this.adjustWithDocumentNode();
    return this.innerNode.querySelector(query);
  }

  defineTemplate() {
    // 상속받은곳에서 직접 구현해야 하는 Template을 return 하는 함수.
    // useEvent도 여기서 사용해서 event 를 정의해줘야한다.
    throw new Error(
      '[Component] : Component를 사용하기 위해서는 Template을 반환하는 함수를 구현해야합니다.'
    );
  }

  getTemplate() {
    // innerNode의 HTML 문자열을 반환합니다. id를 붙여서 반환합니다.
    return `<div class=${this.containerClass} id=${this.id}> ${this.innerHTML} </div>`;
  }

  setTemplate() {
    // 이 함수는 변경사항이 없더라도 Template을 재생성합니다!
    const $container = $.create('div');
    $container.classList.add(this.containerClass);
    this.innerHTML = this.defineTemplate();
    $container.innerHTML = this.innerHTML;
    $container.id = this.id;
    this.innerNode = $container;
    // 하위 node가 있다면 하위 node의 innerHTML과 innerNode도 최신으로 갱신합니다.

    Object.keys(this.childs).forEach((key) => {
      this.childs[key].setTemplate();
    });
  }

  render() {
    this.preTemplate();
    this.setTemplate();

    // Event 재등록
    this.setEvent(this.innerNode);
    if (this.$target) {
      this.$target.appendChild(this.innerNode);
    }
    this.isComponentMounted = true;
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
    // 필요하다면 더 자세한 비교 방법은 재정의하여 정의한다.
    for (const key in prevState) {
      if (newState[key] !== prevState[key]) {
        return true;
      }
    }
    return false;
  }
}
