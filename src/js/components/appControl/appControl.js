import Columns from "../columns/Columns";
import createCloneEl from "../dragNdrop _funcs/createClonEl";

export default class AppControl {
    constructor(parentEl) {
        this.parentEl = parentEl;
        this.draggingElement = null;
		this.draggingClone = null;
    }
    bindToDOM() {
        const columnsInstance = new Columns(this.parentEl);
        if (localStorage.getItem('markup')) {
            columnsInstance.bindToDOM(localStorage.getItem('markup'));
        } else {
            columnsInstance.bindToDOM(columnsInstance.getColumnsMarkdown());
        }

        this.columnsWrapperEl = this.parentEl.querySelector('.columns-wrapper');
        this.addListeners();
    }
    addListeners() {
        this.columnsWrapperEl.addEventListener('mouseover', (e) => {
            const target = e.target;
            if (target.classList.contains('card-remover')) target.classList.add('active');
            if (target.classList.contains('card-wrapper') || target.classList.contains('card-content')) {
                const wrapperEl = target.closest('.card-wrapper');
                const remover = wrapperEl.querySelector('.card-remover');
                remover.classList.add('active');
            }
        });
        this.columnsWrapperEl.addEventListener('mouseout', (e) => {
            const target = e.target;
            if (target.classList.contains('card-wrapper') || target.classList.contains('card-content')) {
                const wrapperEl = target.closest('.card-wrapper');
                const remover = wrapperEl.querySelector('.card-remover');
                remover.classList.remove('active');
            }
        })

        document.addEventListener('pointerdown', this.onMouseDown);
        document.addEventListener('pointerup', this.onMouseUp);
    }
    onMouseDown = (e) => {
        const target = e.target;
        if (target.closest('.card-wrapper')) {
            const draggedEl = target.closest('.card-wrapper');
            this.draggingElement = draggedEl;

            this.shiftX = e.offsetX;
			this.shiftY = e.offsetY;

            draggedEl.style.left = `${e.clientX - this.shiftX}px`;
            draggedEl.style.top = `${e.clientY - this.shiftY}px`;

            this.onDragged(e);
            document.addEventListener('pointermove', this.onMouseMove);
        }
    }
    onMouseUp = () => {
        if (this.draggingElement) {
            this.draggingElement.classList.remove('dragged');
			this.replaceDragging();
		}
        this.clear();
        document.removeEventListener('pointermove', this.onMouseMove);
        localStorage.setItem('markup', this.parentEl.innerHTML);
    }
    onMouseMove = (e) => {
        e.preventDefault();

        if (this.draggingElement) {
            this.draggingElement.style.left = `${e.clientX - this.shiftX}px`;
            this.draggingElement.style.top = `${e.clientY - this.shiftY}px`;

            const { width } = window.getComputedStyle(this.draggingElement);

            this.setDragged(this.draggingElement, width);
            this.onDragged(e);
        }
    }
    clear() {
        this.draggingElement = null;
		this.draggingClone = null;
    }

    setDragged(el, width) {
        el.classList.add('dragged');
        el.style.width = width;
    }
    removeDragged(el) {
        el.classList.remove('dragged');
    }
    replaceDragging() {
        this.draggingClone.replaceWith(this.draggingElement);
    }
    onDragged = (e) => {
        const target = e.target.closest('.card-wrapper');
        const column = e.target.classList.contains('column-item');

        // если навели на карточку
        if (target) {
            let cloneEl= createCloneEl(target);
    
            const { y, height } = target.getBoundingClientRect();
            const appendPosition = y + height / 2 > e.clientY
                ? "beforebegin"
                : "afterend";
            if (!this.draggingClone) {
                this.draggingClone = cloneEl;
            } else {
                this.draggingClone.remove();
                target.insertAdjacentElement(appendPosition, this.draggingClone);
            }

        }
        // если навели на колонку 
        if (column) {
            let cardsContainer = e.target.querySelector('.cards');

            // * Внутри контейнера ЛИБО пусто, ЛИБО будет дрэг-элемент, который мы перетаскиваем, но он остается внутри контейнера, поэтому длина 0 или 1
            if (![...cardsContainer.children].length || cardsContainer.children.length === 1) {
                this.draggingClone.remove();
                cardsContainer.append(this.draggingClone);
            }
        }
    }
}