import { NameValidator } from './name-validator.js';

export class FormValidator {
    constructor() {
        this.validators = {
            name: new NameValidator()
        };
    }

    validateField(input, type) {
        const validator = this.validators[type];
        if (!validator) return true;
        return validator.validate(input);
    }

    showValidationError(input) {
        input.reportValidity();
        input.focus();
    }
}