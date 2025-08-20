import { ModalManager } from './controllers/modal-manager.js';
import { FormController } from './controllers/form-controller.js';
import { SmoothScrollManager } from './managers/scroll-manager.js';
import { AnimationManager } from './managers/animation-manager.js';

/**
 * Controlador principal de la aplicación
 */
class App {
    constructor() {
        this.modalManager = new ModalManager('thankyouModal');
        this.formController = new FormController('contactForm', this.modalManager);
        this.scrollManager = new SmoothScrollManager();
        this.animationManager = new AnimationManager();
    }

    init() {
        this.modalManager.setupEventListeners();
        console.info('MovilAd App inicializada correctamente');
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});

// Funciones globales para compatibilidad
window.openThankyouModal = () => {
    const modalManager = new ModalManager('thankyouModal');
    modalManager.open();
};

window.closeThankyouModal = () => {
    const modalManager = new ModalManager('thankyouModal');
    modalManager.close();
};