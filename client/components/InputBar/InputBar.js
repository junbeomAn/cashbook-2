import Component from '@/lib/Component';
import down from '@/asset/down.svg';
import saveEmpty from '@/asset/saveEmpty.png';
import './InputBar.scss';

export default class InputBar extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'input-bar',
      componentState: { count: 0 },
    });
  }

  preTemplate() {}

  defineTemplate() {
    return `
    <div class="input-bar-background">
      <div class="input-bar-section">
        <p>일자</p>
        <input type="text" placeholder="ex ) 20210720">
      </div>
      <div class="input-bar-vertical-line"></div>
      <div class="input-bar-section">
        <p>분류</p>
        <div class="input-bar-dropdown-section">
          <p>선택하세요</p>
          <img src=${down} />
        </div>
      </div>
      <div class="input-bar-vertical-line"></div>
      <div class="input-bar-section">
        <p>내용</p>
        <input type="text" placeholder="입력하세요">
      </div>
      <div class="input-bar-vertical-line"></div>
      <div class="input-bar-section">
        <p>결제수단</p>
        <div class="input-bar-dropdown-section">
          <p>선택하세요</p>
          <img src=${down}/>
        </div>
      </div>
      <div class="input-bar-vertical-line"></div>
      <div class="input-bar-section">
        <p>금액</p>
        <div class="input-bar-price-input">
          <p>-</p>
          <input type="text" placeholder="입력하세요">
          <p>원</p>
        </div>
      </div>
      <img class="input-bar-save-img" src=${saveEmpty}/>
    </div>`;
  }
}
