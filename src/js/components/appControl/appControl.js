import Columns from "../columns/Columns";
import createCloneEl from "../dragNdrop _funcs/createClonEl";
import moveAt from "../dragNdrop _funcs/moveAt";
import onMove from "../dragNdrop _funcs/onMove";

export default class AppControl {
    constructor(parentEl) {
        this.parentEl = parentEl;

        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);

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

        document.addEventListener('pointerdown', (e) => {
            const target = e.target;
            this.actualEl;    
            if (target.classList.contains('card-wrapper') || target.classList.contains('card-content')) {
                e.preventDefault();
                let shiftX = e.clientX - target.getBoundingClientRect().left;
                let shiftY = e.clientY - target.getBoundingClientRect().top;

                this.actualEl = target.closest('.card-wrapper');

                this.onMouseDown(this.actualEl);
                moveAt(this.actualEl, e.pageX, e.pageY, shiftX, shiftY);

                this.onMouseMoveFunc = (e) => onMove.call(null, e, this.actualEl, shiftX, shiftY); // функция колбек для движения мыши
                this.onMouseUpFunc = () => this.onMouseUp.call(null, this.actualEl); // функция колбек после отпускания левой кнопки мыши

                document.addEventListener('pointermove', this.onMouseMoveFunc);
                this.actualEl.addEventListener('pointerup', this.onMouseUpFunc);
            }
        })
    }

    onMouseDown(el) {
        // const clones = document.querySelectorAll('.clone');
        // if (clones.length) clones.forEach(el => el.remove());

        const cardsContainer = el.closest('.cards');
        let {width: wrapperWidth} = cardsContainer.getBoundingClientRect();
        el.style.width = wrapperWidth + 'px';

        let dragRect = el.getBoundingClientRect();
        let cloneEl = createCloneEl(dragRect);

        console.log(cloneEl)

        if (el.nextElementSibling != null) {
            console.log('Вставляем клона перед!');
            cardsContainer.insertBefore(cloneEl, el.nextElementSibling);
        } else {
            console.log('Вставляем клона в конец')
            cardsContainer.append(cloneEl);
        }

        el.classList.add('dragged');
    }
    onMouseUp(el) {
        let clone = document.querySelector('.clone') || null; // находим клонированный элемент (силуэт)

        if (clone){
            clone.replaceWith(el);
            clone.remove();
        }
        el.classList.remove('dragged');
        el.style.width = '100%';

        // удаляем обработчики
        document.removeEventListener('mousemove', this.onMouseMoveFunc);
        this.actualEl.removeEventListener('mouseup', this.onMouseUpFunc);

        localStorage.setItem('markup', this.parentEl.innerHTML);
    }
}