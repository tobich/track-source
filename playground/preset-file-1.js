function doSomething(x) {
    for(let i=0; i<7; i++) {
        if(i % 3 === 0) {
            x += i;
            x += 1;
        } else {
            x++;
        }
    }
}

function rolloverHandler(event) {
    for(let i=0; i<10; i++) {
        doSomething(i);
    }

}

window.myHandler && document.querySelector('#button1').removeEventListener('click', window.myHandler);
window.myHandler = rolloverHandler;
document.querySelector('#button1').addEventListener('click', window.myHandler);