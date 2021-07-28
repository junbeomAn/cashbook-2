import Component from '../../lib/Component';

export default class Layout extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'test-page',
      componentState: { count: 0 },
    });
  }

  preTemplate() {}

  defineTemplate() {
    return '';
  }
}
