import Component from '@/lib/Component';
import { MODAL_ANIMATION_TIME, SECOND_PER_FRAME } from '@/util/constant';
import github1 from '@/asset/github/github1.png';
import github2 from '@/asset/github/github2.png';
import github3 from '@/asset/github/github3.png';
import github4 from '@/asset/github/github4.png';
import github5 from '@/asset/github/github5.png';
import github6 from '@/asset/github/github6.png';
import github7 from '@/asset/github/github7.png';
import github8 from '@/asset/github/github8.png';
import github9 from '@/asset/github/github9.png';
import github10 from '@/asset/github/github10.png';
import github11 from '@/asset/github/github11.png';
import github12 from '@/asset/github/github12.png';
import github13 from '@/asset/github/github13.png';
import github14 from '@/asset/github/github14.png';
import github15 from '@/asset/github/github15.png';
import github16 from '@/asset/github/github16.png';
import github17 from '@/asset/github/github17.png';
import github18 from '@/asset/github/github18.png';
import github19 from '@/asset/github/github19.png';
import github20 from '@/asset/github/github20.png';
import github21 from '@/asset/github/github21.png';
import github22 from '@/asset/github/github22.png';
import github23 from '@/asset/github/github23.png';
import github24 from '@/asset/github/github24.png';
import { API_END_POINT, API_KEY, REDIRECT_URI } from '../../config';

import './Modal.scss';

const animationImages = [
  github1,
  github2,
  github3,
  github4,
  github5,
  github6,
  github7,
  github8,
  github9,
  github10,
  github11,
  github12,
  github13,
  github14,
  github15,
  github16,
  github17,
  github18,
  github19,
  github20,
  github21,
  github22,
  github23,
  github24,
];

const githubUrl = `https://github.com/login/oauth/authorize?client_id=${API_KEY}&redirect_uri=${REDIRECT_URI}`;

export default class Modal extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'login-modal',
    });
    this.outAnimation = this.outAnimation.bind(this);
  }

  outAnimation() {
    const $background = this.querySelector('.modal-background-black');
    const $container = this.querySelector('.modal-container');

    $background.classList.remove('modal-background-black-start');
    $container.classList.remove('modal-container-start');
    $background.classList.add('modal-background-black-end');
    $container.classList.add('modal-container-end');
    // Delete me on end.
    setTimeout(() => {
      const $this = document.querySelector(`#${this.id}`);
      $this.parentNode.removeChild($this);
      if (this.props.onCancelClick) {
        this.props.onCancelClick();
      }
    }, MODAL_ANIMATION_TIME);
  }

  preTemplate() {
    this.addEvent('.modal-cancel-text', 'click', async () => {
      this.outAnimation(this.props.onCancelClick);
    });
    this.addEvent('.modal-login-button', 'click', async () => {
      window.location.href = githubUrl;
    });

    let imgIndex = 0;
    let imgInterval = null;
    let imgIntervalRunning = false;
    this.addEvent('.modal-login-button', 'mouseenter', () => {
      const $img = this.querySelector('.modal-login-button > img');
      if (!imgIntervalRunning) {
        imgInterval = setInterval(() => {
          imgIntervalRunning = true;
          $img.src = animationImages[imgIndex];
          imgIndex += 1;
          imgIndex %= animationImages.length;
        }, SECOND_PER_FRAME);
      }
    });

    this.addEvent('.modal-login-button', 'mouseleave', () => {
      const $img = this.querySelector('.modal-login-button > img');
      if (imgIntervalRunning) {
        clearInterval(imgInterval);
        imgIndex = 0;
        imgIntervalRunning = false;
        $img.src = animationImages[imgIndex];
      }
    });
  }

  defineTemplate() {
    const title = this.props.title || '';
    const cancelText = this.props.cancelText || '';
    const cancelColor = this.props.cancelColor || 'grey';
    return `
    <div class="modal-background-black modal-background-black-start">
      <div class="modal-container modal-container-start">
        <p class="modal-title-text">${title}</p>
        <button class="modal-login-button">
          <img src="${github1}"/>
          <a href="${githubUrl}"><p>GitHub으로 로그인</p></a>
        </button>
        <div class="modal-button-container">
          <p class="modal-cancel-text modal-cancel-text-${cancelColor}">${cancelText}</p>
        </div>
      </div>
    </div>`;
  }
}
