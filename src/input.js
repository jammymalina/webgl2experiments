let oldCoords;
let wheelTimeout = null;

let mouse = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    wheelDelta: 0,
    leftButtonDown: false,
    rightButtonDown: false,
};

window.addEventListener('mousemove', function(e) {
    if (typeof oldCoords === 'undefined') {
        oldCoords = {
            x: e.clientX,
            y: e.clientY
        };
    }
    mouse.x  = e.clientX;
    mouse.y  = e.clientY;
    mouse.dx = mouse.x - oldCoords.x;
    mouse.dy = mouse.y - oldCoords.y;

    oldCoords.x = mouse.x;
    oldCoords.y = mouse.y;
});

window.addEventListener('mousedown', function(e) {
    if (!mouse.leftButtonDown && e.button === 0) {
        mouse.leftButtonDown = true;
    }
    if (!mouse.rightButtonDown && e.button === 2) {
        mouse.rightButtonDown = true;
    }
});

window.addEventListener('mouseup', function(e) {
    if (mouse.leftButtonDown && e.button === 0) {
        mouse.leftButtonDown = false;
    }
    if (mouse.rightButtonDown && e.button === 2) {
        mouse.rightButtonDown = false;
    }
});

window.addEventListener('wheel', function(e) {
    mouse.wheelDelta = e.wheelDelta;
    if (wheelTimeout !== null) {
        clearTimeout(wheelTimeout);
        wheelTimeout = null;
    }
    wheelTimeout = setTimeout(function() {
        mouse.wheelDelta = 0;
    }, 200);
});

export class MouseInput {
    static get x() {
        return mouse.x;
    }
    static get y() {
        return mouse.y;
    }
    static get dx() {
        return mouse.dx;
    }
    static get dy() {
        return mouse.dy;
    }
    static get wheelDelta() {
        return mouse.wheelDelta;
    }
    static resetWheelDelta() {
        if (wheelTimeout !== null) {
            clearTimeout(wheelTimeout);
            wheelTimeout = null;
        }
        mouse.wheelDelta = 0;
    }
}
