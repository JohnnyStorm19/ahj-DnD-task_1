import createCloneEl from "./createClonEl";
import moveAt from "./moveAt";

export default function onMove(e, el, shiftX, shiftY) {
    moveAt(el, e.pageX, e.pageY, shiftX, shiftY);

    const columns = document.querySelector('.columns-wrapper');
    const clone = columns.querySelector('.clone') || null; // ищем клон дрэг-элемента 
    const dragRect = el.getBoundingClientRect(); // координаты перетаскиваемого элемента

    el.hidden = true;
    let belowCard;
    let cloneEl = createCloneEl(dragRect); // создаем силуэт дрэг-элемента

    const elementBelow = document.elementFromPoint(dragRect.x, dragRect.y);

    // если навели на элемент и его родитель .card-wrapper (т.е. карточка)
    if (elementBelow && elementBelow.closest('.card-wrapper')) {
        belowCard = elementBelow.closest('.card-wrapper');
        const belowCardCords = belowCard.getBoundingClientRect();
        const belowCardCentrY = belowCardCords.top + belowCardCords.height / 2;

        // центр дрэг-элемента
        const dragCardCentrX = dragRect.left + dragRect.width / 2;
        // const dragCardCentrY = dragRect.top + dragRect.height / 2;
        // истина, если Х дрэг-элемента находится внутри карточки по горизонтали
        const dragX = belowCardCords.right > dragCardCentrX && belowCardCords.left < dragCardCentrX;
        // истина, если Y дрэг-элемента находится внутри верхней половины карточки по вертикали
        const dragTopY = e.clientY < belowCardCentrY && e.clientY >= belowCardCords.top;
        // истина, если Y дрэг-элемента находится внутри нижней половины карточки по вертикали
        const dragBottomY = e.clientY > belowCardCentrY && e.clientY < belowCardCords.bottom;

        if (dragTopY && dragX) {
            console.log('Верхняя часть элемента');
            if (clone) clone.remove();
            belowCard.before(cloneEl);
        } 
        if (dragBottomY && dragX) {
            console.log('Нижняя часть элемента');
            if (clone) clone.remove();
            belowCard.after(cloneEl);    
        }
        return;
    }
    // находим пустой столбец
    if (elementBelow && elementBelow.closest('.column-item')) {
        const cardsContainer = elementBelow.querySelector('.cards');
        if ((cardsContainer && ![...cardsContainer.children].length) || (cardsContainer && [...cardsContainer.children][0] === el)) {
            if (clone) clone.remove();
            cardsContainer.append(cloneEl);
        }
    }
    el.hidden = false;
}