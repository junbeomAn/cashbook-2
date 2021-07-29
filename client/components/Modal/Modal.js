import Component from '@/lib/Component';
import './Modal.scss';

export default class Modal extends Component {
  constructor(params) {
    super({
      ...params,
      componentName: 'modal',
    });
  }

  preTemplate() {}

  defineTemplate() {
    const title = this.props.title || '';
    const cancelText = this.props.cancelText || '';
    const submitText = this.props.submitText || '';
    const placeholder = this.props.placeholder || '';
    return `
    <div class="modal-background-black">
      <div class="modal-container">
        <p>${title}</p>
        <input type="text" placeholder=${placeholder}>
        <div class="modal-button-container">
          <p class="modal-cancel-text">${cancelText}</p>
          <p class="modal-submit-text">${submitText}</p>
        </div>
      </div>
    </div>`;
  }
}
