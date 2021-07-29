import Component from '@/lib/Component';
import Header from '@/components/Header/Header';
import InputBar from '@/components/InputBar/InputBar';
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

    new InputBar({
      parent: this,
      keyword: 'input-bar',
    });
  }

  defineTemplate() {
    return `
    <div class="app-background">
      ${this.resolveChild('header')}
      ${this.resolveChild('input-bar')}
    </div>`;
  }
}
