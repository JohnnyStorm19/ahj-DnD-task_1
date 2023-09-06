export default function createCloneEl(el) {
    const dragRect = el.getBoundingClientRect();
    const cloneWidth = dragRect.width;
    const cloneHeight = dragRect.height;

    const cloneEl = document.createElement('div');
    cloneEl.classList.add('clone');

    cloneEl.style.width = cloneWidth + 'px';
    cloneEl.style.height = cloneHeight + 'px';

    return cloneEl;
}