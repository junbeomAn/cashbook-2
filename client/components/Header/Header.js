import Component from '@/lib/Component';
import './Header.scss';

export default class Header extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'header',
      componentState: { year: 2021, month: 7 },
    });
  }

  preTemplate() {}

  defineTemplate() {
    return '';
  }
}
