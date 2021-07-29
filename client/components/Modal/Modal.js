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
    const cancelColor = this.props.cancelColor || 'grey';
    const submitColor = this.props.submitColor || 'mint';
    return `
    <div class="modal-background-black modal-background-black-start">
      <div class="modal-container modal-container-start">
        <p class="modal-title-text">${title}</p>
        <input class="modal-input" type="text" placeholder=${placeholder}>
        <div class="modal-button-container">
          <p class="modal-cancel-text modal-cancel-text-${cancelColor}">${cancelText}</p>
          <p class="modal-submit-text modal-submit-text-${submitColor}">${submitText}</p>
        </div>
      </div>
    </div>`;
  }
}
