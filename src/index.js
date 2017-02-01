import GLInstance from './gl';
import BasicMesh from './mesh';

let gl;

window.addEventListener('load', function() {
    gl = new GLInstance('glcanvas').frameSetSize(500, 500).frameClear();

<<<<<<< HEAD
=======


>>>>>>> f7908861844a25063e01dd01692edb02441c3ad2
    window.addEventListener('resize', function() {
        //gl.frameSetSize(window.innerWidth, window.innerHeight);
    });
});
