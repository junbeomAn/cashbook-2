import Component from '@/lib/Component';
import down from '@/asset/down.svg';
import saveEmpty from '@/asset/saveEmpty.png';
import './InputBar.scss';

export default class InputBar extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'input-bar',
    });
  }

  preTemplate() {}

  defineTemplate() {
    const date = this.props.date || '';
    const category = this.props.category || '선택하세요';
    const content = this.props.content || '';
    const payment = this.props.payment || '선택하세요';
    const amount = this.props.amount || '';
    return `
    <div class="input-bar-background">
      <div class="input-bar-section">
        <p>일자</p>
        <input type="text" placeholder="ex ) 20210720" value=${date}>
      </div>
      <div class="input-bar-vertical-line"></div>
      <div class="input-bar-section">
        <p>분류</p>
        <div class="input-bar-dropdown-section">
          <p>${category}</p>
          <img src=${down} />
        </div>
      </div>
      <div class="input-bar-vertical-line"></div>
      <div class="input-bar-section">
        <p>내용</p>
        <input type="text" placeholder="입력하세요" value=${content}>
      </div>
      <div class="input-bar-vertical-line"></div>
      <div class="input-bar-section">
        <p>결제수단</p>
        <div class="input-bar-dropdown-section">
          <p>${payment}</p>
          <img src=${down}/>
        </div>
      </div>
      <div class="input-bar-vertical-line"></div>
      <div class="input-bar-section">
        <p>금액</p>
        <div class="input-bar-price-input">
          <p>-</p>
          <input type="text" placeholder="입력하세요" vale=${amount}>
          <p>원</p>
        </div>
      </div>
      <img class="input-bar-save-img" src=${saveEmpty}/>
    </div>`;
  }
}
