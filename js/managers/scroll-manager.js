import { Utils } from '../utils/utils.js';
import { CONFIG } from '../config/config.js';

export class SmoothScrollManager {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const anchors = Utils.findElements('a[href^="#"]');
        
        anchors.forEach(anchor => {
            anchor.addEventListener('click', (e) => this._handleAnchorClick(e));
        });
    }

    _handleAnchorClick(e) {
        e.preventDefault();
        
        const href = e.currentTarget.getAttribute('href');
        const target = Utils.findElement(href);
        
        if (target) {
            this._scrollToTarget(target);
        }
    }

    _scrollToTarget(target) {
        target.scrollIntoView({
            behavior: CONFIG.SCROLL_BEHAVIOR,
            block: 'start'
        });
    }
}