import './popover.css';

export default class PopoverWidget {
    constructor(parentEl) {
        this.parentEl = parentEl;
    }

    static getPopoverMarkup(title, text) {
        return `
        <div class="popover-wrapper">
            <div class="popover-title" data-title=${title}></div>
            <div class="popover-text" data-text=${text}></div>
        </div>
        `
    }

    bindToDOM() {
        const btn = this.createButton('btn', 'I am button and if you click me - popover appears');
        btn.addEventListener('click', () => {
            console.log('clicked!')
            this.onClick(btn);
        });
        this.parentEl.append(btn);
    }

    createButton(className, text, el = 'button') {
        const element = document.createElement(el);
        element.classList.add(className);
        element.setAttribute('title', 'Popover title');
        element.textContent = text;
        return element;
    }

    createPopover(title, text) {
        const popoverWrapper = document.createElement('div');
        popoverWrapper.classList.add('popover-wrapper');

        const popoverTitle = document.createElement('div');
        popoverTitle.classList.add('popover-title');

        const popoverText = document.createElement('div');
        popoverText.classList.add('popover-text');

        popoverTitle.dataset.head = title;
        popoverText.dataset.text = text;

        popoverTitle.textContent = title;
        popoverText.textContent = text;

        popoverWrapper.append(popoverTitle);
        popoverWrapper.append(popoverText);

        return popoverWrapper;
    }

    onClick(btn) {
        if (btn.children.length != 0) {
            [...btn.children].forEach(o => o.remove());
            return;
        }
        const popover = this.createPopover('Usual popover', 'Time flies when you\'re having fun');
        btn.append(popover);
    }
}