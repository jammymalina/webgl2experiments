import GLInstance from './gl';

let gl;

window.addEventListener('load', function() {
    gl = new GLInstance('glcanvas').frameSetSize(500, 500).frameClear();

    

    window.addEventListener('resize', function() {
        //gl.frameSetSize(window.innerWidth, window.innerHeight);
    });
});
