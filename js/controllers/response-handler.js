import { Utils } from '../utils/utils.js';

export class ResponseHandler {
    constructor(form, modalManager) {
        this.form = form;
        this.modalManager = modalManager;
    }

    handleSuccess(response, data) {
        console.info('Form enviado OK:', response.status, data);
        this.form.reset();
        this.modalManager.open();
    }

    handleRedirect(response) {
        console.info('Redirección detectada:', response.status);
        this.form.reset();
        this.modalManager.open();
    }

    handleServerError(response, text) {
        console.warn('Respuesta no OK del servidor:', response.status, text);
        alert('Ocurrió un error al enviar el mensaje. Por favor, intenta nuevamente.');
    }

    handleNetworkError(error) {
        Utils.handleError(error, 'red o bloqueo del navegador');

        if (error?.name === 'AbortError') {
            alert('La conexión tardó demasiado. Si recibimos tu mensaje te contactaremos igual. Inténtalo de nuevo más tarde.');
        } else {
            alert('Error de conexión. Por favor, verifica tu red o desactiva bloqueadores y vuelve a intentar.');
        }
    }
}