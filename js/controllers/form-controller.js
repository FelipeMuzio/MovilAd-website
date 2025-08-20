import { Utils } from '../utils/utils.js';
import { FormValidator } from '../validators/validator.js';
import { SubmitButtonController } from './submit-button-controller.js';
import { ResponseHandler } from './response-handler.js';
import { CONFIG } from '../config/config.js';

export class FormController {
    constructor(formId, modalManager) {
        this.form = Utils.findElement(`#${formId}`);
        this.validator = new FormValidator();
        this.modalManager = modalManager;
        this.responseHandler = new ResponseHandler(this.form, modalManager);
        
        if (this.form) {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this._handleSubmit(e));
    }

    async _handleSubmit(e) {
        e.preventDefault();

        if (!this._validateForm()) {
            return;
        }

        await this._submitForm();
    }

    _validateForm() {
        const nameInput = this.form.querySelector("input[name='name']");
        
        if (nameInput && !this.validator.validateField(nameInput, 'name')) {
            this.validator.showValidationError(nameInput);
            return false;
        }

        return true;
    }

    async _submitForm() {
        const formData = new FormData(this.form);
        const submitBtn = this.form.querySelector('.submit-btn');
        const buttonController = new SubmitButtonController(submitBtn);

        buttonController.setLoading();

        const controller = new AbortController();
        const timeout = Utils.createTimeout(controller, CONFIG.FORM_TIMEOUT);

        try {
            const response = await this._makeRequest(formData, controller);
            await this._handleResponse(response);
        } catch (error) {
            this.responseHandler.handleNetworkError(error);
        } finally {
            clearTimeout(timeout);
            buttonController.restore();
        }
    }

    async _makeRequest(formData, controller) {
        return fetch(this.form.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' },
            signal: controller.signal
        });
    }

    async _handleResponse(response) {
        if (response.ok) {
            const data = await this._parseJsonSafely(response);
            this.responseHandler.handleSuccess(response, data);
            return;
        }

        if (this._isRedirect(response.status)) {
            this.responseHandler.handleRedirect(response);
            return;
        }

        const text = await response.text().catch(() => '(sin cuerpo)');
        this.responseHandler.handleServerError(response, text);
    }

    async _parseJsonSafely(response) {
        try {
            return await response.json();
        } catch {
            return null;
        }
    }

    _isRedirect(status) {
        return [301, 302, 303, 307, 308].includes(status);
    }
}