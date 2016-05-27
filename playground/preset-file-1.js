function rolloverHandler(event) {
    let x = 0;
    for(let i=0; i<15; i++) {
        if(i % 3 === 0) {
            x += i;
            x += 1;
            x += 2;
            x += 3;
        } else {
            x++;
        }
    }
}

window.myHandler && document.querySelector('#button1').removeEventListener('click', window.myHandler);
window.myHandler = rolloverHandler;
document.querySelector('#button1').addEventListener('click', window.myHandler);