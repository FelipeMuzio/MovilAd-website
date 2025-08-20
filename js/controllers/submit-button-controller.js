export class SubmitButtonController {
    constructor(button) {
        this.button = button;
        this.originalText = button ? button.textContent : null;
    }

    setLoading() {
        if (!this.button) return;
        
        this.button.textContent = 'Enviando...';
        this.button.disabled = true;
    }

    restore() {
        if (!this.button) return;
        
        this.button.textContent = this.originalText ?? 'Enviar';
        this.button.disabled = false;
    }
}