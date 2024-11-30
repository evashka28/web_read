class SpeechFocusComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: Arial, sans-serif;
                    margin: 16px;
                }
                .focusable {
                    outline: none;
                    cursor: pointer;
                    padding: 8px;
                    margin: 4px 0;
                    border: 1px solid transparent;
                    transition: border-color 0.2s ease;
                }
                .focusable:focus {
                    border-color: #0078d7;
                    background-color: #f0f8ff;
                }
                .focusable:hover {
                    border-color: #0078d7;
                    background-color: #f0f8ff;
                }
            </style>
            <h1 class="focusable" tabindex="0">
                <slot name="title">Default Title</slot>
            </h1>
            <p class="focusable" tabindex="0">
                <slot name="text">Default paragraph text.</slot>
            </p>
        `;

        this.speechHandler = this.speechHandler.bind(this);
    }

    connectedCallback() {
        const focusableElements = this.shadowRoot.querySelectorAll('.focusable');
        focusableElements.forEach(element => {
            element.addEventListener('focus', this.speechHandler); // При фокусе
            element.addEventListener('click', this.speechHandler); // При клике
        });
    }

    disconnectedCallback() {
        const focusableElements = this.shadowRoot.querySelectorAll('.focusable');
        focusableElements.forEach(element => {
            element.removeEventListener('focus', this.speechHandler);
            element.removeEventListener('click', this.speechHandler);
        });
    }

    speechHandler(event) {
        const element = event.target;
        const slot = element.querySelector('slot');
        const text = slot ? slot.assignedNodes().map(node => node.textContent).join(' ').trim() : element.textContent.trim();

        if (text && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text); // Озвучиваем текст
            window.speechSynthesis.cancel(); // Очищаем очередь
            window.speechSynthesis.speak(utterance);
        }
    }
}

customElements.define('speech-focus-component', SpeechFocusComponent);
