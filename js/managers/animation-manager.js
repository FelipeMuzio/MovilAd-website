import { Utils } from '../utils/utils.js';
import { CONFIG } from '../config/config.js';

export class AnimationManager {
    constructor() {
        this.observer = this._createObserver();
        this.setupAnimations();
    }

    setupAnimations() {
        const elements = Utils.findElements('.fade-in-up');
        
        elements.forEach(element => {
            this._prepareElement(element);
            this.observer.observe(element);
        });
    }

    _createObserver() {
        const options = {
            threshold: CONFIG.OBSERVER_THRESHOLD,
            rootMargin: CONFIG.OBSERVER_ROOT_MARGIN
        };

        return new IntersectionObserver((entries) => {
            this._handleIntersection(entries);
        }, options);
    }

    _prepareElement(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `all ${CONFIG.ANIMATION_DURATION}s ease`;
    }

    _handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this._animateElement(entry.target);
            }
        });
    }

    _animateElement(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }
}