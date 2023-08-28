export default function moveAt(element, pageX, pageY, shiftX, shiftY) {

    element.style.left = pageX - shiftX + 'px';
    element.style.top = pageY - shiftY + 'px';
}
