import AppControl from "./components/appControl/appControl";

const container = document.querySelector('.container');
const appControl = new AppControl(container);
appControl.bindToDOM();