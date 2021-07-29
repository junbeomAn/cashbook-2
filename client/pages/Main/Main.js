import Component from '@/lib/Component';
import './Main.scss';

export default class Main extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'main-page',
      componentState: { count: 0 },
    });
  }

  preTemplate() {}

  defineTemplate() {
    return '<div></div>';
  }
}
