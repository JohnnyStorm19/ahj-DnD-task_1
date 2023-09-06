import Card from '../cards/Card';
import './columns.css'

export default class Columns {
    constructor(parentEl) {
        this.parentEl = parentEl;
    }
    
    getColumnsMarkdown() {
        return `<main class="wrapper">
            <div class="columns-wrapper">
                <div class="column-item" data-item="todo">
                    <div class="column-header">
                        <h2 class="column-title">Todo</h2>
                        <span class="settings">...</span>
                    </div>
                    <div class="cards"></div>
                    <span class="add-card">+ Add another card</span>
                    <form class="form card-content-form" id="form">
                        <span class="error">Please, enter card content!</span>
                        <textarea class="textarea" form="form" placeholder="Enter card content..."></textarea>
                        <div class="form-settings-wrapper">
                            <button type="submit" class="add-content-btn">Add card</button>
                            <span class="form-remover">X</span>
                        </div>
                    </form>
                </div>
                <div class="column-item" data-item="inprogress">
                    <div class="column-header">
                        <h2 class="column-title">In progress</h2>
                        <span class="settings">...</span>
                    </div>
                    <div class="cards"></div>
                    <span class="add-card">+ Add another card</span>
                    <form class="form card-content-form">
                        <span class="error">Please, enter card content!</span>
                        <textarea class="textarea" form="form" placeholder="Enter card content..."></textarea>
                        <div class="form-settings-wrapper">
                            <button type="submit" class="add-content-btn">Add card</button>
                            <span class="form-remover">X</span>
                        </div>
                    </form>
                </div>
                <div class="column-item" data-item="done">
                    <div class="column-header">
                        <h2 class="column-title">Done</h2>
                        <span class="settings">...</span>
                    </div>
                    <div class="cards"></div>
                    <span class="add-card">+ Add another card</span>
                    <form class="form card-content-form">
                        <span class="error">Please, enter card content!</span>
                        <textarea class="textarea" form="form" placeholder="Enter card content..."></textarea>
                        <div class="form-settings-wrapper">
                            <button type="submit" class="add-content-btn">Add card</button>
                            <span class="form-remover">X</span>
                        </div>
                    </form>
                </div>
            </div>
        </main>
        `
    }

    bindToDOM(markDown) {
        this.parentEl.insertAdjacentHTML('beforeend', markDown);
        this.addListeners();
    }

    addListeners() {
        const columnsWrapper = document.querySelector('.columns-wrapper');

        const forms = this.parentEl.querySelectorAll('form');

        columnsWrapper.addEventListener('input', (e) => {
            const target = e.target;
            if (target.classList.contains('textarea')) {
                this.closeError(target);
            }
        })

        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                const target = e.target;
                let parent = target.closest('.column-item');
                e.preventDefault();
                this.addCard(form, target, parent);
            })
        })

        columnsWrapper.addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains('add-card')) {
                this.revealForm(target);
            }
            if (target.classList.contains('form-remover')) {
                this.closeAddingCardForm(target);
            }
            if (target.classList.contains('card-remover')) {
                const cardEl = target.closest('.card-wrapper');
                Card.removeCard(cardEl);
                localStorage.setItem('markup', this.parentEl.innerHTML);
            }
        });
    }

    revealError(textArea) {
        const error = textArea.previousElementSibling;
        error.classList.add('active');
    }
    closeError(textArea) {
        const error = textArea.previousElementSibling;
        error.classList.remove('active');
    }
    revealForm(target) {
        target.style.display = "none";
        const columnItem = target.closest('.column-item');
        let form = columnItem.querySelector('.form');
        form.classList.add('form-active');
    }
    closeAddingCardForm(target) {
        const columnItemEl = target.closest('.column-item');
        const addCardEl = columnItemEl.querySelector('.add-card')
        const form = target.closest('.form');

        form.classList.remove('form-active');
        addCardEl.style.display = 'block';
    }
    addCard(form, target, parentEl) {
        const cardsContainer = parentEl.querySelector('.cards');
        const formArea = form.querySelector('.textarea');

        if (!formArea.value) {
            this.revealError(formArea);
            return;
        }
        const cardInstance = new Card(formArea.value);
        let cardMarkup = cardInstance.getCardMarkup(cardInstance.content);

        cardsContainer.insertAdjacentHTML('afterbegin', cardMarkup);

        formArea.value = '';
        this.closeAddingCardForm(target);
        localStorage.setItem('markup', this.parentEl.innerHTML);
    }
}