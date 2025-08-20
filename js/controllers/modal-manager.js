import { Utils } from '../utils/utils.js';

export class ModalManager {
    constructor(modalId) {
        this.modalId = modalId;
    }

    open() {
        const modal = Utils.findElement(`#${this.modalId}`);
        if (!modal) return;

        this._showModal(modal);
        this._blockBodyScroll();
        this._focusOkButton(modal);
    }

    close() {
        const modal = Utils.findElement(`#${this.modalId}`);
        if (!modal) return;

        this._hideModal(modal);
        this._restoreBodyScroll();
    }

    setupEventListeners() {
        this._setupClickHandlers();
        this._setupKeyboardHandlers();
    }

    // Métodos privados...
    _showModal(modal) {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
    }

    _hideModal(modal) {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
    }

    _blockBodyScroll() {
        document.body.style.overflow = 'hidden';
    }

    _restoreBodyScroll() {
        document.body.style.overflow = '';
    }

    _focusOkButton(modal) {
        const okButton = modal.querySelector('.modal-ok');
        if (okButton) okButton.focus();
    }

    _setupClickHandlers() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-close-modal]')) {
                this.close();
            }
        });
    }

    _setupKeyboardHandlers() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
    }
}