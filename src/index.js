import GLInstance from './gl';
import BasicMesh from './mesh';
import MouseOrbitCamera from './camera/mouseorbit';
import planeBufferGeometry from './geometry/plane';
import Shader from './shader';
import Transform from './transform';
import { loadScene } from './scene';

let gl;

window.addEventListener('load', function() {
    gl = new GLInstance('glcanvas').frameSetSize(500, 500).frameClear();

    loadScene('./src/scenes/basic.json').then(scene => {
        console.log('Loading scene finished');
        console.log(scene);
    });

    window.addEventListener('resize', function() {
        gl.frameSetSize(window.innerWidth, window.innerHeight);
    });
});
