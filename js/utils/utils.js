export class Utils {
    static findElement(selector) {
        return document.querySelector(selector);
    }

    static findElements(selector) {
        return document.querySelectorAll(selector);
    }

    static createTimeout(controller, ms) {
        return setTimeout(() => controller.abort(), ms);
    }

    static handleError(error, context) {
        console.error(`Error en ${context}:`, error?.name, error?.message);
    }
}