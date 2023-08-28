import './card.css';

export default class Card {
    constructor(content) {
        this.content = content;
    }
    getCardMarkup(content) {
        return `
            <div class="card-wrapper">
                <div class="card-content">${content}</div>
                <span class="card-remover">X</span>
            </div>
        `
    }
    static removeCard(cardEl) {
        cardEl.remove();
    }
}