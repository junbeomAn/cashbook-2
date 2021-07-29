import Component from '@/lib/Component';
import Header from '@/components/Header/Header';
import './Main.scss';
import '@/pages/global.scss';

export default class Main extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'main-page',
      componentState: { count: 0 },
    });
  }

  preTemplate() {
    new Header({
      parent: this,
      keyword: 'header',
      props: {
        navigationLocation: 0,
      },
    });
  }

  defineTemplate() {
    return `
    <div class="app-background">
      ${this.resolveChild('header')}
    </div>`;
  }
}
