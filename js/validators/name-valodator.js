export class NameValidator {
    constructor() {
        this.regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
        this.errorMessage = "El nombre no puede contener números ni caracteres especiales.";
    }

    validate(input) {
        const value = input.value.trim();
        
        if (!this.regex.test(value)) {
            input.setCustomValidity(this.errorMessage);
            return false;
        }
        
        input.setCustomValidity("");
        return true;
    }
}